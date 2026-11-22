/* Shared drafting and microphone controls for learning answers. */
(function () {
  const bucket = 'learning-recordings';
  const maxRecordingMs = 10 * 60 * 1000;
  const content = document.querySelector('#content');
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  const android = /Android/i.test(navigator.userAgent);
  const micPolicy = document.permissionsPolicy || document.featurePolicy;
  const fields = new Map();
  const localAudio = new Map();
  const remoteAudio = new Set();
  let database, active, audioSync, syncAgain, owner, generation = 0, syncTimer, listed = false;

  function openAudioDatabase() {
    if (!database) database = new Promise((resolve, reject) => {
      const request = indexedDB.open('pflegefokus-recordings', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('recordings', {keyPath: ['user', 'key']}).createIndex('user', 'user');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(error => { database = null; throw error; });
    return database;
  }

  async function audioTransaction(mode, action) {
    const db = await openAudioDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('recordings', mode);
      const request = action(transaction.objectStore('recordings'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  function note(ui, text) {
    if (ui.tools.isConnected) ui.status.textContent = text;
  }

  function refreshAudio(ui) {
    const local = localAudio.get(ui.key);
    const hasAudio = local?.pending ? Boolean(local.blob) : remoteAudio.has(ui.key) || Boolean(local?.blob);
    ui.play.hidden = !hasAudio;
    ui.remove.hidden = !hasAudio;
    ui.record.textContent = hasAudio ? 'Neu aufnehmen & diktieren' : 'Aufnehmen & diktieren';
  }

  function detachPlayback(ui) {
    if (!ui.player) return;
    ui.player.pause();
    ui.player.removeAttribute('src');
    ui.player.hidden = true;
    if (ui.url) URL.revokeObjectURL(ui.url);
    ui.url = null;
  }

  async function updateLocalAudio(record) {
    await audioTransaction('readwrite', store => store.put(record));
    if (owner !== record.user) return;
    localAudio.set(record.key, record);
    const ui = fields.get(record.key);
    if (ui) {
      detachPlayback(ui);
      refreshAudio(ui);
      note(ui, record.blob ? 'Aufnahme auf diesem Gerät gespeichert.' : 'Aufnahme auf diesem Gerät gelöscht.');
    }
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncAudio, 700);
  }

  async function readRemoteAudio(user, session) {
    const names = new Set();
    let offset = 0;
    while (true) {
      const {data, error} = await cloudClient.storage.from(bucket).list(user, {limit: 100, offset, sortBy: {column: 'name', order: 'asc'}});
      if (error) throw error;
      for (const file of data) if (file.name.endsWith('.audio')) names.add(file.name.slice(0, -6));
      if (data.length < 100) break;
      offset += data.length;
    }
    if (session !== generation) return;
    names.forEach(name => remoteAudio.add(name));
    listed = true;
    fields.forEach(refreshAudio);
  }

  async function setOwner(user) {
    if (owner === user) return;
    if (active) active.discard = true;
    stopCapture();
    generation++;
    const session = generation;
    owner = user;
    localAudio.clear();
    remoteAudio.clear();
    listed = false;
    fields.forEach(ui => {detachPlayback(ui); refreshAudio(ui);});
    if (!user) return;
    scan();
    try {
      const records = await audioTransaction('readonly', store => store.index('user').getAll(user));
      if (session !== generation) return;
      records.forEach(record => {if (!localAudio.has(record.key)) localAudio.set(record.key, record);});
      fields.forEach(refreshAudio);
    } catch {
      // Typing remains available if local recording storage is blocked.
    }
    syncAudio();
  }

  async function syncAudio() {
    if (!owner || !cloudClient || !navigator.onLine) return;
    if (audioSync) {syncAgain = true; return;}
    const session = generation;
    const user = owner;
    audioSync = true;
    try {
      if (!listed) await readRemoteAudio(user, session);
      for (const record of localAudio.values()) {
        if (session !== generation) break;
        if (!record.pending) continue;
        const storage = cloudClient.storage.from(bucket);
        const path = user+'/'+record.key+'.audio';
        const result = record.blob ? await storage.upload(path, record.blob, {upsert: true, contentType: record.blob.type.split(';')[0] || 'audio/webm'})
          : await storage.remove([path]);
        if (result.error) throw result.error;
        if (session !== generation || localAudio.get(record.key) !== record) continue;
        // Compare in the same local transaction so a newer recording stays queued.
        const updated = {...record, pending: false};
        await audioTransaction('readwrite', store => {
          const request = store.get([user,record.key]);
          request.onsuccess = () => {if(request.result?.version===record.version)store.put(updated);};
          return request;
        });
        if (session !== generation || localAudio.get(record.key) !== record) continue;
        // Once synced, read the latest recording from cloud when the device is online.
        localAudio.set(record.key, updated);
        if (record.blob) remoteAudio.add(record.key);
        else remoteAudio.delete(record.key);
        if (fields.has(record.key)) note(fields.get(record.key), record.blob ? 'Aufnahme mit deinem Konto synchronisiert.' : 'Aufnahme auch im Konto gelöscht.');
      }
    } catch {
      if (session === generation) fields.forEach(ui => {
        if (localAudio.get(ui.key)?.pending) note(ui, 'Änderung ist auf diesem Gerät gespeichert. Die Cloud-Synchronisierung steht noch aus.');
      });
    } finally {
      audioSync = false;
      if (syncAgain) {syncAgain = false; if (owner) queueMicrotask(syncAudio);}
    }
  }

  async function playAudio(ui) {
    if (!owner) return;
    if (ui.url) {ui.player.play().catch(() => {});return;}
    const session = generation;
    const path = owner+'/'+ui.key+'.audio';
    const local = localAudio.get(ui.key);
    let blob = local?.blob;
    if (navigator.onLine && remoteAudio.has(ui.key) && !local?.pending) {
      note(ui, 'Aufnahme wird geladen …');
      try {
        const result = await cloudClient.storage.from(bucket).download(path);
        if (!result.error) blob = result.data;
        else if (Number(result.error.statusCode) === 404) {
          if (generation !== session) return;
          remoteAudio.delete(ui.key);
          localAudio.delete(ui.key);
          await audioTransaction('readwrite', store => store.delete([owner, ui.key]));
          refreshAudio(ui);
          note(ui, 'Diese Aufnahme wurde im Konto gelöscht.');
          return;
        }
      } catch { /* Offline playback can still use the local file. */ }
    }
    if (!blob || !ui.tools.isConnected || session !== generation || localAudio.get(ui.key) !== local) {
      note(ui, 'Aufnahme gerade nicht verfügbar.');
      return;
    }
    ui.url = URL.createObjectURL(blob);
    ui.player.src = ui.url;
    ui.player.hidden = false;
    note(ui, '');
    ui.player.play().catch(() => {});
  }

  function writeAnswer(key, text, user = owner, route = tab) {
    if (!user || user !== owner || user !== cloudUser?.id) return;
    const ui = fields.get(key);
    (state.answerDrafts ??= {})[key] = {text, updated: Date.now()};
    if (route === tab) state.lastAnswer = {key,tab};
    if (ui?.field.isConnected && ui.field.value !== text) ui.field.value = text;
    save();
    if (ui) note(ui, cloudLocalSaved ? 'Auf diesem Gerät gespeichert.' : 'Lokales Speichern fehlgeschlagen.');
  }

  function appendSpeech(capture, text) {
    if (!text || capture.session !== generation || capture.discard) return;
    if (capture.ui.field.dataset.answerSearch !== undefined) {
      capture.ui.field.value = text;
      capture.ui.field.dispatchEvent(new Event('input', {bubbles:true}));
      return;
    }
    const key = capture.ui.key;
    const previous = state.answerDrafts?.[key]?.text ?? capture.ui.field.value;
    writeAnswer(key, [previous.trimEnd(),text.trim()].filter(Boolean).join(' ').slice(0, 16000), capture.user, capture.route);
  }

  function microphoneError(error) {
    if (micPolicy?.allowsFeature('microphone') === false) {
      return 'Diese Ansicht blockiert das Mikrofon. Öffne die Seite in einem eigenen Chrome-Tab.';
    }
    switch (error) {
      case 'NotAllowedError':
      case 'not-allowed':
        return 'Mikrofonzugriff verweigert. Erlaube ihn in den Chrome-Website-Einstellungen und in den Android-App-Berechtigungen.';
      case 'NotReadableError':
      case 'audio-capture':
        return 'Das Mikrofon ist gerade nicht erreichbar. Schließe andere Apps mit Mikrofonzugriff und versuche es erneut.';
      case 'NotFoundError':
        return 'Der Browser hat kein Mikrofon gefunden.';
      case 'network':
        return 'Der Spracherkennungsdienst ist nicht erreichbar. Prüfe die Internetverbindung.';
      case 'service-not-allowed':
        return 'Chrome hat den Spracherkennungsdienst in dieser Sitzung abgelehnt.';
      case 'no-speech':
        return 'Es wurde keine Sprache erkannt. Warte auf „Sprich jetzt“ und versuche es erneut.';
      case 'language-not-supported':
        return 'Die Spracherkennung für Deutsch ist in diesem Browser gerade nicht verfügbar.';
      default:
        return 'Mikrofon oder Spracherkennung konnte nicht gestartet werden.';
    }
  }

  function startRecognition(capture, track) {
    if (!Speech) return;
    let recognizer;
    try {
      recognizer = new Speech();
      capture.recognition = recognizer;
      recognizer.lang = 'de-DE';
      recognizer.continuous = !android;
      recognizer.interimResults = true;

      recognizer.onstart = () => {
        clearTimeout(capture.startNotice);
        if (active === capture) note(capture.ui, capture.recorder ?
          'Aufnahme und Diktat laufen. Sprich jetzt.' : 'Diktat läuft. Sprich jetzt.');
      };
      recognizer.onresult = event => {
        const final = [], interim = [];
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          (result.isFinal ? final : interim).push(result[0].transcript);
        }
        capture.interim = interim.join(' ').trim();
        if (final.length) {
          const text = final.join(' ').trim();
          if (text) capture.speechReceived = true;
          appendSpeech(capture, text);
        }
      };
      recognizer.onerror = event => {
        capture.speechFailed = true;
        clearTimeout(capture.startNotice);
        if (event.error !== 'aborted') note(capture.ui,
          microphoneError(event.error)+(capture.recorder?' Die Audioaufnahme läuft weiter.':''));
      };
      recognizer.onend = () => {
        clearTimeout(capture.startNotice);
        if (capture.discard) return;
        if (capture.interim && !capture.speechFailed) {
          appendSpeech(capture, capture.interim);
          capture.speechReceived = true;
        }
        capture.interim = '';
        if (capture.ending) {
          if (!capture.speechFailed && !capture.speechReceived && !capture.recorder) {
            note(capture.ui, 'Diktat beendet. Es wurde noch kein Text erkannt.');
          }
          return;
        }
        if (active !== capture) return;
        if (!capture.recorder) {
          if (!capture.speechFailed) note(capture.ui, capture.speechReceived ?
            'Diktat gespeichert.' : 'Das Diktat endete ohne erkannten Text. Tippe auf „Diktieren“, um es erneut zu versuchen.');
          releaseCapture(capture);
        } else if (!capture.speechFailed && capture.speechReceived) {
          // Android ends a recognition session after one utterance. Keep recording
          // and reopen recognition for the next utterance when the track supports it.
          setTimeout(() => {
            if (active === capture) startRecognition(capture, track);
          }, 350);
        }
      };
      if (track) recognizer.start(track);
      else recognizer.start();
    } catch (error) {
      capture.recognition = null;
      capture.speechFailed = true;
      clearTimeout(capture.startNotice);
      note(capture.ui, microphoneError(error.name)+(capture.recorder?' Die Audioaufnahme läuft weiter.':''));
      if (!capture.recorder) releaseCapture(capture);
    }
  }

  function releaseCapture(capture) {
    if (active === capture) active = null;
    clearTimeout(capture.timer);
    clearTimeout(capture.startNotice);
    capture.ui.stop.hidden = true;
    if (capture.ui.record) capture.ui.record.disabled = !canRecord;
    if (capture.ui.recordOnly) capture.ui.recordOnly.disabled = !canRecord;
    capture.ui.dictate.disabled = !Speech;
  }

  function stopCapture() {
    const capture = active;
    if (!capture) return;
    capture.ending = true;
    releaseCapture(capture);
    if (capture.recorder && capture.recorder.state !== 'inactive') {
      note(capture.ui, 'Aufnahme wird gespeichert …');
      try {capture.recorder.stop();}
      catch {
        capture.stream?.getTracks().forEach(track => track.stop());
        note(capture.ui, 'Die Aufnahme konnte nicht abgeschlossen werden.');
      }
    } else if (capture.stream) {
      capture.stream.getTracks().forEach(track => track.stop());
    } else if (capture.mode !== 'dictate') {
      note(capture.ui, 'Aufnahme abgebrochen, bevor das Mikrofon bereit war.');
    } else if (!capture.speechFailed) {
      note(capture.ui, 'Diktat wird abgeschlossen …');
    }
    try {capture.recognition?.stop();}
    catch {
      if (capture.interim && !capture.speechFailed) appendSpeech(capture, capture.interim);
    }
  }

  function createRecorder(stream) {
    const opus = 'audio/webm;codecs=opus';
    if (window.MediaRecorder.isTypeSupported?.(opus)) {
      return new MediaRecorder(stream, {mimeType: opus});
    }
    return new MediaRecorder(stream);
  }

  async function startCapture(ui, mode) {
    if (active) {
      note(ui, 'Beende zuerst die laufende Aufnahme oder das Diktat.');
      return;
    }
    if (!window.isSecureContext && typeof window.isSecureContext === 'boolean') {
      note(ui, 'Die Sprachfunktion erfordert eine sichere Verbindung. Öffne die HTTPS-Seite in Chrome.');
      return;
    }
    if (micPolicy?.allowsFeature('microphone') === false) {
      note(ui, microphoneError('NotAllowedError'));
      return;
    }
    const record = mode !== 'dictate';
    if (record && (localAudio.get(ui.key)?.blob || remoteAudio.has(ui.key)) && !confirm('Die gespeicherte Aufnahme ersetzen?')) return;
    const capture = {ui, mode, user: owner, session: generation, route: tab};
    active = capture;
    if (ui.record) ui.record.disabled = true;
    if (ui.recordOnly) ui.recordOnly.disabled = true;
    ui.dictate.disabled = true;
    ui.stop.hidden = false;
    note(ui, record ? 'Mikrofonzugriff wird angefragt …' : 'Spracherkennung wird gestartet …');
    capture.timer = setTimeout(stopCapture, maxRecordingMs);
    capture.startNotice = setTimeout(() => {
      if (active === capture) note(ui, 'Der Start dauert länger. Prüfe, ob Chrome gerade nach der Mikrofonberechtigung fragt.');
    }, 9000);
    if (!record) {startRecognition(capture); return;}
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if (active !== capture) {stream.getTracks().forEach(track => track.stop()); return;}
      clearTimeout(capture.startNotice);
      capture.stream = stream;
      const recorder = createRecorder(stream);
      const chunks = [];
      capture.recorder = recorder;
      recorder.ondataavailable = event => {if (event.data.size) chunks.push(event.data);};
      recorder.onerror = event => {
        releaseCapture(capture);
        stream.getTracks().forEach(track => track.stop());
        note(ui, 'Die Audioaufnahme wurde unterbrochen'+(event.error?.name ? ' ('+event.error.name+').' : '.'));
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, {type: recorder.mimeType || chunks[0]?.type});
        if (!blob.size) {note(ui, 'Die Aufnahme war leer. Warte beim nächsten Versuch auf „Aufnahme läuft“.'); return;}
        try {
          await updateLocalAudio({user:capture.user, key:ui.key, blob, pending:true, version:crypto.randomUUID()});
        } catch {
          if (owner === capture.user && capture.session === generation) {
            localAudio.set(ui.key, {blob, pending:false});
            detachPlayback(ui);
            refreshAudio(ui);
          }
          note(ui, 'Aufnahme ist bis zum Neuladen abspielbar. Chrome hat das Speichern auf diesem Gerät abgelehnt.');
        }
      };
      recorder.start(1000);
      note(ui, 'Aufnahme läuft. Sprich jetzt.');
      if (mode === 'both' && Speech) startRecognition(capture, stream.getAudioTracks()[0]);
    } catch (error) {
      if (active !== capture) return;
      releaseCapture(capture);
      capture.stream?.getTracks().forEach(track => track.stop());
      note(ui, microphoneError(error.name));
    }
  }

  function configure(field) {
    const search = field.matches('input[type="search"]');
    const key = field.dataset.answer || (search && field.id ? 'search-'+field.id : null);
    if (!key || field.dataset.answerReady) return;
    const tools = document.createElement('div');
    const ui = {key, field, tools};
    tools.className = 'answer-tools';
    tools.innerHTML = '<p class="answer-status muted" role="status"></p>'+
      (search ? '' : '<button type="button" class="btn" data-voice="record">Aufnehmen &amp; diktieren</button><button type="button" class="btn" data-voice="recordOnly">Nur aufnehmen</button>')+
      '<button type="button" class="btn" data-voice="dictate">Diktieren</button><button type="button" class="btn primary" data-voice="stop" hidden>Beenden</button>'+
      (search ? '' : '<button type="button" class="btn" data-voice="play" hidden>Meine Antwort anhören</button><button type="button" class="btn" data-voice="remove" hidden>Aufnahme löschen</button><button type="button" class="btn" data-voice="summary">Stichpunkte vorschlagen</button><audio controls preload="none" hidden aria-label="Deine Sprachaufnahme"></audio>')+
      (search ? '' : '<details class="answer-note"><summary>Hinweise zu Mikrofon und Audio</summary><p>Aufnahmen sind bis zu zehn Minuten lang und werden nach dem Beenden automatisch gespeichert. Je nach Browser kann die Spracherkennung einen externen Dienst verwenden. Nutze fiktive Angaben.</p></details>');
    for (const button of tools.querySelectorAll('[data-voice]')) ui[button.dataset.voice] = button;
    ui.status = tools.querySelector('[role="status"]');
    ui.player = tools.querySelector('audio');
    ui.dictate.disabled = !Speech;
    ui.dictate.onclick = () => startCapture(ui, 'dictate');
    ui.stop.onclick = stopCapture;
    field.dataset.answerReady = 'true';
    field.after(tools);
    if (search) {
      field.dataset.answerSearch = '';
      if (!Speech) tools.hidden = true;
      return;
    }
    const draft = state.answerDrafts?.[key];
    if (draft) field.value = draft.text;
    field.maxLength = 16000;
    field.addEventListener('input', () => writeAnswer(key, field.value));
    ui.record.disabled = ui.recordOnly.disabled = !canRecord;
    if (!canRecord) note(ui, 'Audioaufnahme ist in diesem Browser gerade nicht verfügbar.');
    ui.record.onclick = () => startCapture(ui, 'both');
    ui.recordOnly.onclick = () => startCapture(ui, 'record');
    ui.play.onclick = () => playAudio(ui);
    ui.remove.onclick = () => {
      if (!owner || active?.ui === ui || !confirm('Diese Sprachaufnahme löschen?')) return;
      updateLocalAudio({user:owner, key, blob:null, pending:true, version:crypto.randomUUID()})
        .catch(() => note(ui,'Aufnahme konnte nicht gelöscht werden.'));
    };
    ui.summary.onclick = () => suggestBullets(ui);
    fields.set(key, ui);
    refreshAudio(ui);
  }

  function suggestBullets(ui) {
    const text = ui.field.value.trim();
    if (!text) {note(ui, 'Schreibe oder diktiere zuerst eine Antwort.');return;}
    const sentences = typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter('de', {granularity:'sentence'}).segment(text), item => item.segment.trim()).filter(Boolean) : text.split(/(?<=[.!?])\s+/);
    const phrases = sentences.length > 1 ? sentences : text.split(/\n+|;\s+|,\s+(?=dann\b|danach\b|anschließend\b|zuerst\b)/i);
    const unique = [...new Set(phrases.map(part => part.trim().replace(/^(?:ähm?[, ]+)+/i,'')).filter(Boolean))];
    const keyPoints = unique.length <= 6 ? unique : unique
      .map((part,index)=>({part,index,priority:index===0||index===unique.length-1?2:/prüf|beobacht|risik|ziel|maßnahme|begründ|weil|damit|evalu|priorit|zuerst|danach/i.test(part)?1:0}))
      .sort((a,b)=>b.priority-a.priority||a.index-b.index).slice(0,6).sort((a,b)=>a.index-b.index).map(item=>item.part);
    const proposal = document.createElement('textarea');
    proposal.value = keyPoints.map(part => '• '+part.replace(/^•\s*/, '')).join('\n');
    proposal.setAttribute('aria-label', 'Vorschlag für Stichpunkte');
    const accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'btn';
    accept.textContent = 'Stichpunkte übernehmen';
    ui.summary.disabled=true;
    ui.tools.append(proposal,accept);
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn';
    cancel.textContent = 'Verwerfen';
    const close = () => {proposal.remove();accept.remove();cancel.remove();ui.summary.disabled=false;ui.summary.focus();};
    accept.onclick = () => {writeAnswer(ui.key,proposal.value.slice(0,16000));close();};
    cancel.onclick = close;
    ui.tools.append(cancel);
    proposal.focus();
  }

  function scan() {
    for (const [key, ui] of fields) {
      if (!ui.field.isConnected) {
        detachPlayback(ui);
        fields.delete(key);
      }
    }
    if (active && !active.ui.field.isConnected) stopCapture();
    if (!owner) return;
    content.querySelectorAll('textarea[data-answer], input[type="search"]').forEach(configure);
  }

  function refreshDrafts() {
    for (const ui of fields.values()) {
      const draft = state.answerDrafts?.[ui.key];
      if (draft && document.activeElement !== ui.field) ui.field.value = draft.text;
    }
  }

  window.voiceAnswers = {setOwner, refreshDrafts, syncAudio, stopCapture};
  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length || record.removedNodes.length)) scan();
  }).observe(content, {childList:true, subtree:true});
  window.addEventListener('online', syncAudio);
  window.addEventListener('pagehide', stopCapture);
  // Android can briefly hide the page while the system microphone prompt is open.
  // A document exit still stops capture via the pagehide handler above.
  document.addEventListener('visibilitychange', () => {if(!document.hidden)syncAudio();});
})();
