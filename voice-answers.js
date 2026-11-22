/* Shared drafting and microphone controls for learning answers. */
(function () {
  const bucket = 'learning-recordings';
  const maxRecordingMs = 10 * 60 * 1000;
  const content = document.querySelector('#content');
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
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
    ui.record.textContent = hasAudio ? 'Neu aufnehmen' : 'Aufnehmen & diktieren';
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
    if (!text || capture.session !== generation) return;
    if (capture.ui.field.dataset.answerSearch !== undefined) {
      capture.ui.field.value = text;
      capture.ui.field.dispatchEvent(new Event('input', {bubbles:true}));
      return;
    }
    const key = capture.ui.key;
    const previous = state.answerDrafts?.[key]?.text ?? capture.ui.field.value;
    writeAnswer(key, [previous.trimEnd(),text.trim()].filter(Boolean).join(' ').slice(0, 16000), capture.user, capture.route);
  }

  function startRecognition(capture, track) {
    if (!Speech) return;
    const recognizer = new Speech();
    capture.recognition = recognizer;
    recognizer.lang = 'de-DE';
    recognizer.continuous = true;
    recognizer.interimResults = false;
    recognizer.onresult = event => {
      const parts = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) parts.push(event.results[i][0].transcript);
      }
      appendSpeech(capture, parts.join(' '));
    };
    recognizer.onerror = event => {
      capture.speechFailed = true;
      if (event.error !== 'aborted') note(capture.ui, capture.recorder ?
        'Diktat gerade nicht verfügbar. Die Audioaufnahme läuft weiter.' : 'Diktat gerade nicht verfügbar. Du kannst deine Antwort eintippen.');
    };
    recognizer.onend = () => {
      if (active !== capture) return;
      if (!capture.recorder) {stopCapture();return;}
      if (!capture.speechFailed) setTimeout(() => {
        if (active === capture) startRecognition(capture, track);
      }, 350);
    };
    try {
      if (track) recognizer.start(track);
      else recognizer.start();
    } catch {
      capture.recognition = null;
      note(capture.ui, capture.recorder ? 'Diktat gerade nicht verfügbar. Audioaufnahme läuft.' : 'Diktat konnte nicht gestartet werden.');
      if (!capture.recorder) stopCapture();
    }
  }

  function stopCapture() {
    const capture = active;
    if (!capture) return;
    active = null;
    clearTimeout(capture.timer);
    try {capture.recognition?.stop();} catch {}
    if (capture.recorder?.state === 'recording') capture.recorder.stop();
    else capture.stream?.getTracks().forEach(track => track.stop());
    capture.ui.stop.hidden = true;
    if (capture.ui.record) capture.ui.record.disabled = !canRecord;
    capture.ui.dictate.disabled = !Speech;
  }

  async function startCapture(ui, record) {
    if (active) {
      note(ui, 'Beende zuerst die laufende Aufnahme oder das Diktat.');
      return;
    }
    if (record && (localAudio.get(ui.key)?.blob || remoteAudio.has(ui.key)) && !confirm('Die gespeicherte Aufnahme ersetzen?')) return;
    const capture = {ui, user: owner, session: generation, route: tab};
    active = capture;
    if (ui.record) ui.record.disabled = true;
    ui.dictate.disabled = true;
    ui.stop.hidden = false;
    note(ui, record ? 'Mikrofon wird geöffnet …' : 'Diktat läuft …');
    capture.timer = setTimeout(stopCapture, maxRecordingMs);
    if (!record) {startRecognition(capture); return;}
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if (active !== capture) {stream.getTracks().forEach(track => track.stop()); return;}
      capture.stream = stream;
      const recorder = new MediaRecorder(stream, {audioBitsPerSecond: 48000});
      const chunks = [];
      capture.recorder = recorder;
      recorder.ondataavailable = event => {if (event.data.size) chunks.push(event.data);};
      recorder.onerror = () => {stopCapture(); note(ui, 'Die Aufnahme wurde unterbrochen.');};
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, {type: recorder.mimeType || chunks[0]?.type});
        if (!blob.size) {note(ui, 'Es wurde kein Audio aufgenommen.'); return;}
        try {
          await updateLocalAudio({user:capture.user, key:ui.key, blob, pending:true, version:crypto.randomUUID()});
        } catch {
          note(ui, 'Aufnahme konnte auf diesem Gerät nicht gespeichert werden.');
        }
      };
      recorder.start(1000);
      note(ui, Speech ? 'Aufnahme läuft. Diktat wird gestartet …' : 'Aufnahme läuft. Dieser Browser unterstützt kein Diktat.');
      startRecognition(capture, stream.getAudioTracks()[0]);
    } catch {
      stopCapture();
      note(ui, 'Mikrofon konnte nicht geöffnet werden. Prüfe die Berechtigung oder tippe deine Antwort.');
    }
  }

  function configure(field) {
    const search = field.matches('input[type="search"]');
    const key = field.dataset.answer || (search && field.id ? 'search-'+field.id : null);
    if (!key || field.dataset.answerReady) return;
    const tools = document.createElement('div');
    const ui = {key, field, tools};
    tools.className = 'answer-tools';
    tools.innerHTML = (search ? '' : '<button type="button" class="btn" data-voice="record">Aufnehmen &amp; diktieren</button>')+
      '<button type="button" class="btn" data-voice="dictate">Diktieren</button><button type="button" class="btn primary" data-voice="stop" hidden>Beenden</button>'+
      (search ? '' : '<button type="button" class="btn" data-voice="play" hidden>Meine Antwort anhören</button><button type="button" class="btn" data-voice="remove" hidden>Aufnahme löschen</button><button type="button" class="btn" data-voice="summary">Stichpunkte vorschlagen</button><audio controls preload="none" hidden aria-label="Deine Sprachaufnahme"></audio>')+
      '<p class="answer-status muted" role="status"></p>'+
      (search ? '' : '<details class="answer-note"><summary>Hinweise zu Mikrofon und Audio</summary><p>Aufnahmen sind bis zu zehn Minuten lang und werden nach dem Beenden automatisch gespeichert. Je nach Browser kann die Spracherkennung einen externen Dienst verwenden. Nutze fiktive Angaben.</p></details>');
    for (const button of tools.querySelectorAll('[data-voice]')) ui[button.dataset.voice] = button;
    ui.status = tools.querySelector('[role="status"]');
    ui.player = tools.querySelector('audio');
    ui.dictate.disabled = !Speech;
    ui.dictate.onclick = () => startCapture(ui, false);
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
    ui.record.disabled = !canRecord;
    if (!canRecord) note(ui, 'Audioaufnahme ist in diesem Browser gerade nicht verfügbar.');
    ui.record.onclick = () => startCapture(ui, true);
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
  document.addEventListener('visibilitychange', () => {if(document.hidden)stopCapture();else syncAudio();});
})();
