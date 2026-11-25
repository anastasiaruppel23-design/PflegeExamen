/* Shared drafting and microphone controls for learning answers. */
(function () {
  const bucket = 'learning-recordings';
  const maxRecordingMs = 10 * 60 * 1000;
  const content = document.querySelector('#content');
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  const OfflineAudio = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const canTranscribe = Boolean(OfflineAudio && window.Worker && window.WebAssembly);
  const android = /Android/i.test(navigator.userAgent);
  const micPolicy = document.permissionsPolicy || document.featurePolicy;
  const fields = new Map();
  const answerSelector = 'textarea[data-answer], textarea[data-voice-reply]';
  const localAudio = new Map();
  const remoteAudio = new Set();
  let database, active, audioSync, syncAgain, owner, generation = 0, syncTimer, listed = false;
  let transcription, transcriptionWorker;

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
    ui.hasAudio = hasAudio;
    refreshButtons(ui);
    refreshPreviousAnswer(ui);
  }

  function refreshPreviousAnswer(ui) {
    if (ui.previousAnswer) {
      ui.previousAnswer.hidden = !ui.hasAudio && !ui.field.value.trim();
    }
  }

  function detachPlayback(ui) {
    if (!ui.player) return;
    ui.player.pause();
    ui.player.removeAttribute('src');
    ui.player.hidden = true;
    if (ui.url) URL.revokeObjectURL(ui.url);
    ui.url = null;
    ui.playbackBlob = null;
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
    cancelTranscription();
    closeTranscriptionWorker();
    generation++;
    const session = generation;
    owner = user;
    localAudio.clear();
    remoteAudio.clear();
    listed = false;
    fields.forEach(ui => {
      detachPlayback(ui);
      setTranscript(ui, '');
      refreshAudio(ui);
    });
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
        const ui = fields.get(record.key);
        if (ui && !ui.audioBusy && active?.ui !== ui && ui.transcript.hidden) {
          note(ui, record.blob ? 'Aufnahme mit deinem Konto synchronisiert.' : 'Aufnahme auch im Konto gelöscht.');
        }
      }
    } catch {
      if (session === generation) fields.forEach(ui => {
        if (!ui.audioBusy && localAudio.get(ui.key)?.pending && active?.ui !== ui && ui.transcript.hidden) {
          note(ui, 'Änderung ist auf diesem Gerät gespeichert. Die Cloud-Synchronisierung steht noch aus.');
        }
      });
    } finally {
      audioSync = false;
      if (syncAgain) {syncAgain = false; if (owner) queueMicrotask(syncAudio);}
    }
  }

  async function playAudio(ui) {
    if (!owner || active || ui.audioBusy) return;
    fields.forEach(other => {if (other !== ui) other.player.pause();});
    if (ui.url) {
      ui.player.play().catch(() => note(ui, 'Tippe im Audioplayer auf Wiedergabe.'));
      return;
    }
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
          if (generation !== session || localAudio.get(ui.key) !== local) return;
          remoteAudio.delete(ui.key);
          localAudio.delete(ui.key);
          const user = owner;
          await audioTransaction('readwrite', store => store.delete([user, ui.key]));
          if (session !== generation) return;
          refreshAudio(ui);
          note(ui, 'Diese Aufnahme wurde im Konto gelöscht.');
          return;
        }
      } catch { /* Offline playback can still use the local file. */ }
    }
    if (active || ui.audioBusy || session !== generation || localAudio.get(ui.key) !== local || !ui.tools.isConnected) return;
    if (!blob) {
      note(ui, 'Aufnahme gerade nicht verfügbar.');
      return;
    }
    if (ui.url) URL.revokeObjectURL(ui.url);
    ui.url = URL.createObjectURL(blob);
    ui.playbackBlob = blob;
    ui.player.src = ui.url;
    ui.player.hidden = false;
    refreshButtons(ui);
    note(ui, '');
    ui.player.play().catch(() => note(ui, 'Tippe im Audioplayer auf Wiedergabe.'));
  }

  function saveDraft(ui) {
    if (!owner || owner !== cloudUser?.id) return;
    (state.answerDrafts ??= {})[ui.key] = {text: ui.field.value, updated: Date.now()};
    state.lastAnswer = {key: ui.key, tab};
    save();
    note(ui, cloudLocalSaved ? 'Auf diesem Gerät gespeichert.' : 'Lokales Speichern fehlgeschlagen.');
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

  function refreshButtons(ui) {
    const capture = active?.ui === ui ? active : null;
    const recording = capture?.mode === 'record' && !capture.ending;
    const dictating = capture?.mode === 'dictate' && !capture.ending;
    ui.dictate.lastElementChild.textContent = dictating ? 'Beenden' : 'Diktieren';
    ui.dictate.dataset.running = String(dictating);
    ui.dictate.disabled = !Speech || Boolean(capture && !dictating);
    if (ui.search) return;
    ui.record.lastElementChild.textContent = recording ? 'Beenden' : 'Aufnehmen';
    ui.record.dataset.running = String(recording);
    ui.record.disabled = !canRecord || ui.audioBusy || Boolean(capture && !recording);
    ui.play.disabled = !ui.hasAudio || ui.audioBusy || Boolean(capture);
    ui.remove.disabled = ui.play.disabled;
    ui.convert.hidden = !ui.playbackBlob;
    ui.convert.disabled = ui.play.disabled || !canTranscribe;
    ui.convert.lastElementChild.textContent = transcription?.ui === ui ? 'Wird umgewandelt …' : 'In Text';
    ui.accept.disabled = !ui.preview.value.trim() || Boolean(capture);
  }

  function setTranscript(ui, text) {
    ui.preview.value = text;
    ui.transcript.hidden = !text;
    refreshButtons(ui);
  }

  function joinText(first, second) {
    return [first.trimEnd(), second.trim()].filter(Boolean).join(' ');
  }

  function exceedsAnswerLimit(field, text) {
    return field.maxLength >= 0 && text.length > field.maxLength;
  }

  function insertAnswer(ui, text, message) {
    ui.field.value = text;
    ui.field.classList.add('answer-expanded');
    ui.field.dispatchEvent(new Event('input', {bubbles:true}));
    if (!ui.field.dataset.answer || cloudLocalSaved) note(ui, message);
    ui.field.focus({preventScroll:true});
    ui.field.scrollIntoView({block:'nearest'});
  }

  function takeTranscript(ui) {
    const text = ui.preview.value.trim();
    if (!text || active?.ui === ui) return;
    const value = joinText(ui.field.value, text);
    if (exceedsAnswerLimit(ui.field, value)) {
      note(ui, 'Die Antwort wäre zu lang. Kürze den Text in der Vorschau.');
      ui.preview.focus();
      return;
    }
    setTranscript(ui, '');
    insertAnswer(ui, value, 'Text in die Antwort übernommen.');
  }

  function closeTranscriptionWorker() {
    transcriptionWorker?.terminate();
    transcriptionWorker = null;
  }

  function finishTranscription(job) {
    if (transcription !== job) return false;
    transcription = null;
    job.ui.audioBusy = false;
    refreshButtons(job.ui);
    return job.ui.field.isConnected;
  }

  function cancelTranscription() {
    if (!transcription) return;
    finishTranscription(transcription);
    closeTranscriptionWorker();
  }

  function transcriptionFailed(job, message) {
    if (transcription !== job) return;
    closeTranscriptionWorker();
    if (finishTranscription(job)) note(job.ui, message);
  }

  function receiveTranscription(job, data) {
    if (transcription !== job) return;
    const {ui} = job;
    if (data.status === 'running') {
      note(ui, 'Die gesamte Aufnahme wird in Text umgewandelt …');
      return;
    }
    if (data.status === 'error') {
      const message = data.phase === 'loading'
        ? 'Die Sprachdateien konnten nicht geladen werden. Prüfe die Internetverbindung und versuche es erneut.'
        : 'Die Aufnahme konnte nicht in Text umgewandelt werden. Du kannst sie weiterhin anhören.';
      transcriptionFailed(job, message);
      return;
    }
    if (data.status !== 'done' || !finishTranscription(job)) return;
    const text = data.text.trim();
    if (!text) {
      note(ui, 'In dieser Aufnahme wurde keine Sprache erkannt.');
    } else if (ui.field.value.trim() || exceedsAnswerLimit(ui.field, text)) {
      setTranscript(ui, joinText(ui.preview.value, text));
      note(ui, 'Der Text steht in der Vorschau. Du kannst ihn bearbeiten und mit „Übernehmen“ zur Antwort hinzufügen.');
      ui.preview.scrollIntoView({block:'nearest'});
    } else {
      insertAnswer(ui, text, 'Aufnahme als Text eingefügt. Du kannst die Antwort jetzt bearbeiten.');
    }
  }

  async function transcribeAudio(ui) {
    if (!owner || !ui.playbackBlob || ui.audioBusy || active || !canTranscribe) return;
    if (ui.field.value.trim()) {
      note(ui, 'Leere das Antwortfeld, um die Aufnahme als Text einzufügen.');
      ui.field.focus({preventScroll:true});
      ui.field.scrollIntoView({block:'nearest'});
      return;
    }
    if (transcription) {
      note(ui, 'Eine andere Aufnahme wird gerade in Text umgewandelt.');
      return;
    }
    const job = {ui};
    transcription = job;
    ui.audioBusy = true;
    ui.player.pause();
    refreshButtons(ui);
    note(ui, 'Aufnahme wird vorbereitet. Beim ersten Mal werden Sprachdateien geladen …');
    try {
      const decoder = new OfflineAudio(1, 1, 16000);
      const audio = await decoder.decodeAudioData(await ui.playbackBlob.arrayBuffer());
      if (transcription !== job || !ui.field.isConnected) return;
      const samples = audio.getChannelData(0).slice();
      for (let channel = 1; channel < audio.numberOfChannels; channel++) {
        const input = audio.getChannelData(channel);
        for (let i = 0; i < samples.length; i++) samples[i] += input[i];
      }
      if (audio.numberOfChannels > 1) {
        for (let i = 0; i < samples.length; i++) samples[i] /= audio.numberOfChannels;
      }
      if (!transcriptionWorker) transcriptionWorker = new Worker('./transcription-worker.js?v=1', {type:'module'});
      transcriptionWorker.onmessage = event => receiveTranscription(job, event.data);
      transcriptionWorker.onerror = () => transcriptionFailed(job, 'Die Spracherkennung konnte nicht gestartet werden. Prüfe die Internetverbindung und versuche es erneut.');
      transcriptionWorker.postMessage(samples, [samples.buffer]);
    } catch {
      transcriptionFailed(job, 'Die Aufnahme konnte nicht für die Spracherkennung geöffnet werden. Du kannst sie weiterhin anhören.');
    }
  }

  function finishDictation(capture) {
    const {ui} = capture;
    const text = joinText(capture.text, recognitionText(capture));
    releaseCapture(capture);
    if (capture.discard || capture.session !== generation || !ui.field.isConnected) return;
    if (!text) {
      note(ui, capture.speechError ? microphoneError(capture.speechError) : 'Es wurde kein Text erkannt. Tippe auf „Diktieren“, um es erneut zu versuchen.');
      return;
    }
    if (ui.search) {
      ui.field.value = text;
      ui.field.dispatchEvent(new Event('input', {bubbles:true}));
      note(ui, 'Diktat in die Suche eingefügt.');
      return;
    }
    setTranscript(ui, joinText(ui.preview.value, text));
    note(ui, capture.speechError && capture.speechError !== 'no-speech'
      ? 'Das Diktat wurde unterbrochen. Der bisher erkannte Text steht in der Vorschau.'
      : 'Tippe auf „Übernehmen“, um den diktierten Text zur Antwort hinzuzufügen.');
  }

  function recognitionText(capture) {
    return joinText(capture.segment, capture.interim);
  }

  function recognitionEnded(capture) {
    clearTimeout(capture.startNotice);
    const segment = recognitionText(capture);
    const retryable = !capture.speechError || capture.speechError === 'no-speech';
    capture.emptyAttempts = segment ? 0 : capture.emptyAttempts + 1;
    if (capture.ending || capture.discard || capture.ui.search || !retryable || capture.emptyAttempts >= 3) {
      finishDictation(capture);
      return;
    }
    capture.text = joinText(capture.text, segment);
    capture.segment = '';
    capture.interim = '';
    capture.speechError = null;
    capture.recognition = null;
    note(capture.ui, 'Diktat wird fortgesetzt …');
    capture.restartTimer = setTimeout(() => startRecognition(capture), 180);
  }

  function startRecognition(capture) {
    if (active !== capture || capture.ending || capture.discard) return;
    try {
      const recognizer = new Speech();
      capture.recognition = recognizer;
      recognizer.lang = 'de-DE';
      // Mobile sessions can end during a pause. Restarting them preserves earlier segments.
      recognizer.continuous = !android;
      recognizer.interimResults = true;
      const isCurrent = () => active === capture && capture.recognition === recognizer;
      recognizer.onstart = () => {
        if (!isCurrent()) return;
        clearTimeout(capture.startNotice);
        if (!capture.ending) note(capture.ui, 'Diktat läuft. Sprich jetzt.');
      };
      recognizer.onresult = event => {
        if (!isCurrent() || capture.discard) return;
        const final = [], interim = [];
        // Results contain the full session, including earlier unchanged results.
        for (const result of Array.from(event.results)) {
          (result.isFinal ? final : interim).push(result[0].transcript);
        }
        capture.segment = final.join(' ').trim();
        capture.interim = interim.join(' ').trim();
      };
      recognizer.onerror = event => {
        if (!isCurrent() || capture.discard) return;
        capture.speechError = event.error;
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          note(capture.ui, microphoneError(event.error));
        }
      };
      recognizer.onend = () => {
        if (isCurrent()) recognitionEnded(capture);
      };
      recognizer.start();
    } catch (error) {
      capture.speechError = error.name;
      finishDictation(capture);
    }
  }

  function releaseCapture(capture) {
    if (active === capture) active = null;
    clearTimeout(capture.timer);
    clearTimeout(capture.startNotice);
    clearTimeout(capture.stopNotice);
    clearTimeout(capture.restartTimer);
    refreshButtons(capture.ui);
  }

  function stopCapture() {
    const capture = active;
    if (!capture || capture.ending) return;
    capture.ending = true;
    clearTimeout(capture.timer);
    clearTimeout(capture.startNotice);
    refreshButtons(capture.ui);
    if (capture.mode === 'dictate') {
      if (!capture.recognition) {
        finishDictation(capture);
        return;
      }
      if (!capture.speechError) note(capture.ui, 'Diktat wird abgeschlossen …');
      try {
        capture.stopNotice = setTimeout(() => {
          if (active !== capture) return;
          finishDictation(capture);
          capture.recognition.abort();
        }, 2500);
        capture.recognition.stop();
      } catch {
        finishDictation(capture);
      }
      return;
    }
    if (!capture.recorder) {
      releaseCapture(capture);
      note(capture.ui, 'Aufnahme abgebrochen, bevor das Mikrofon bereit war.');
      return;
    }
    if (capture.recorder.state === 'inactive') return;
    note(capture.ui, 'Aufnahme wird gespeichert …');
    try {
      capture.recorder.stop();
    } catch {
      capture.stream.getTracks().forEach(track => track.stop());
      releaseCapture(capture);
      note(capture.ui, 'Die Aufnahme konnte nicht abgeschlossen werden.');
    }
  }

  function createRecorder(stream) {
    const opus = 'audio/webm;codecs=opus';
    if (window.MediaRecorder.isTypeSupported?.(opus)) {
      return new MediaRecorder(stream, {mimeType: opus});
    }
    return new MediaRecorder(stream);
  }

  async function recordAudio(capture) {
    const {ui} = capture;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if (active !== capture) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      clearTimeout(capture.startNotice);
      capture.stream = stream;
      const recorder = createRecorder(stream);
      const chunks = [];
      capture.recorder = recorder;
      recorder.ondataavailable = event => {if (event.data.size) chunks.push(event.data);};
      recorder.onerror = event => {
        stream.getTracks().forEach(track => track.stop());
        note(ui, 'Die Audioaufnahme wurde unterbrochen'+(event.error?.name ? ' ('+event.error.name+').' : '.'));
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, {type: recorder.mimeType || chunks[0]?.type});
        try {
          if (blob.size) {
            await updateLocalAudio({user:capture.user, key:ui.key, blob, pending:true, version:crypto.randomUUID()});
          } else {
            note(ui, 'Die Aufnahme war leer. Warte beim nächsten Versuch auf „Aufnahme läuft“.');
          }
        } catch {
          if (capture.session === generation) {
            localAudio.set(ui.key, {blob, pending:false});
            detachPlayback(ui);
            refreshAudio(ui);
            note(ui, 'Aufnahme ist bis zum Neuladen abspielbar. Der Browser hat das Speichern abgelehnt.');
          }
        } finally {
          releaseCapture(capture);
        }
      };
      recorder.start(1000);
      note(ui, 'Aufnahme läuft. Sprich jetzt.');
    } catch (error) {
      if (active !== capture) return;
      capture.stream?.getTracks().forEach(track => track.stop());
      releaseCapture(capture);
      note(ui, microphoneError(error.name));
    }
  }

  function startCapture(ui, mode) {
    if (!owner) return;
    if (active) {
      if (active.ui === ui && active.mode === mode) stopCapture();
      else note(ui, 'Beende zuerst die laufende Aufnahme oder das Diktat.');
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
    const record = mode === 'record';
    if (record && ui.hasAudio && !confirm('Die gespeicherte Aufnahme ersetzen?')) return;
    fields.forEach(other => other.player.pause());
    const capture = {ui, mode, user: owner, session: generation, text: '', segment: '', interim: '', emptyAttempts: 0};
    active = capture;
    refreshButtons(ui);
    note(ui, record ? 'Mikrofonzugriff wird angefragt …' : 'Spracherkennung wird gestartet …');
    capture.timer = setTimeout(stopCapture, maxRecordingMs);
    capture.startNotice = setTimeout(() => {
      if (active === capture) note(ui, 'Der Start dauert länger. Prüfe, ob der Browser nach der Mikrofonberechtigung fragt.');
    }, 9000);
    if (record) recordAudio(capture);
    else startRecognition(capture);
  }

  const icons = {
    record: '<circle cx="12" cy="12" r="6" fill="#b42332" stroke="none"/>',
    dictate: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1m-7 8v3m-3 0h6"/>',
    play: '<path d="m8 5 12 7-12 7z" fill="currentColor" stroke="none"/>',
    accept: '<path d="m5 12 4 4L19 6"/>',
    convert: '<path d="M5 4h14M12 4v16m-4 0h8"/>',
    remove: '<path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/>'
  };

  function voiceButton(action, label, className = '') {
    return '<button type="button" class="btn '+className+'" data-voice="'+action+'">'+
      '<svg class="answer-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
      icons[action]+(action === 'record' || action === 'dictate' ? '<rect class="answer-stop" x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>' : '')+
      '</svg><span>'+label+'</span></button>';
  }

  function configure(field) {
    const search = field.matches('input[type="search"]');
    const key = field.dataset.answer || field.dataset.voiceReply;
    if (field.dataset.answerReady) return;
    const tools = document.createElement('div');
    const ui = {key, field, tools, search, audioBusy: false, previousAnswer: field.closest('[data-previous-answer]')};
    tools.className = 'answer-tools';
    const dictate = voiceButton('dictate', 'Diktieren');
    tools.innerHTML = '<p class="answer-status muted" role="status"></p>'+
      (search ? dictate : '<div class="answer-actions">'+voiceButton('record', 'Aufnehmen')+dictate+
        voiceButton('play', 'Anhören')+voiceButton('accept', 'Übernehmen')+'</div>'+
        '<audio controls preload="none" hidden aria-label="Deine Sprachaufnahme"></audio>'+
        voiceButton('remove', 'Löschen', 'answer-remove')+
        voiceButton('convert', 'In Text', 'answer-convert')+
        '<label class="answer-transcript" hidden>Diktatvorschau<textarea rows="3"></textarea></label>'+
        '<details class="answer-note"><summary>Hinweise zu Mikrofon und Audio</summary><p>Aufnahmen sind bis zu zehn Minuten lang und werden nach dem Beenden automatisch gespeichert. Öffne eine Aufnahme mit „Anhören“. „In Text“ wandelt sie auf diesem Gerät um und füllt ein leeres Antwortfeld. Beim ersten Mal lädt der Browser dafür Sprachdateien (rund 66 MB).</p>'+
        '<p>„Diktieren“ erkennt Sprache live. Mit „Übernehmen“ fügst du die Vorschau ins Antwortfeld ein. Je nach Browser kann das Live-Diktat einen externen Dienst verwenden. Nutze fiktive Angaben.</p>'+
        (!canTranscribe ? '<p>„In Text“ ist in diesem Browser nicht verfügbar.</p>' : '')+
        (field.dataset.voiceReply ? '<p>Die Sprachaufnahme bleibt bei dir. Gesendet wird der Text aus dem Antwortfeld.</p>' : '')+'</details>');
    for (const button of tools.querySelectorAll('[data-voice]')) ui[button.dataset.voice] = button;
    ui.status = tools.querySelector('[role="status"]');
    ui.dictate.onclick = () => startCapture(ui, 'dictate');
    field.dataset.answerReady = 'true';
    field.after(tools);
    if (search) {
      refreshButtons(ui);
      if (!Speech) tools.hidden = true;
      return;
    }
    ui.player = tools.querySelector('audio');
    ui.transcript = tools.querySelector('.answer-transcript');
    ui.preview = ui.transcript.querySelector('textarea');
    ui.preview.oninput = () => refreshButtons(ui);
    if (field.dataset.answer) {
      const draft = state.answerDrafts?.[key];
      if (draft) field.value = draft.text;
      field.maxLength = 16000;
      field.addEventListener('input', () => saveDraft(ui));
    }
    ui.record.onclick = () => startCapture(ui, 'record');
    ui.play.onclick = () => playAudio(ui);
    ui.accept.onclick = () => takeTranscript(ui);
    ui.convert.onclick = () => transcribeAudio(ui);
    ui.remove.onclick = async () => {
      if (!owner || active?.ui === ui || !confirm('Diese Sprachaufnahme löschen?')) return;
      ui.audioBusy = true;
      refreshButtons(ui);
      try {
        await updateLocalAudio({user:owner, key, blob:null, pending:true, version:crypto.randomUUID()});
      } catch {
        note(ui, 'Aufnahme konnte nicht gelöscht werden.');
      } finally {
        ui.audioBusy = false;
        refreshButtons(ui);
      }
    };
    if (!canRecord && !Speech) note(ui, 'Aufnehmen und Diktieren sind in diesem Browser nicht verfügbar.');
    else if (!canRecord) note(ui, 'Aufnehmen ist in diesem Browser nicht verfügbar.');
    else if (!Speech) note(ui, 'Diktieren ist in diesem Browser nicht verfügbar.');
    fields.set(key, ui);
    refreshAudio(ui);
  }

  function scan() {
    for (const [key, ui] of fields) {
      if (!ui.field.isConnected) {
        detachPlayback(ui);
        fields.delete(key);
      }
    }
    if (active && !active.ui.field.isConnected) stopCapture();
    if (transcription && !transcription.ui.field.isConnected) cancelTranscription();
    if (!owner) return;
    content.querySelectorAll(answerSelector+', input[type="search"]').forEach(configure);
  }

  function refreshDrafts() {
    for (const ui of fields.values()) {
      if (!ui.field.dataset.answer) continue;
      const draft = state.answerDrafts?.[ui.key];
      if (draft && document.activeElement !== ui.field) ui.field.value = draft.text;
      refreshPreviousAnswer(ui);
    }
  }

  window.voiceAnswers = {setOwner, refreshDrafts, syncAudio, stopCapture};
  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length || record.removedNodes.length)) scan();
  }).observe(content, {childList:true, subtree:true});
  window.addEventListener('online', syncAudio);
  window.addEventListener('pagehide', () => {
    stopCapture();
    cancelTranscription();
    closeTranscriptionWorker();
  });
  // Android can briefly hide the page while the system microphone prompt is open.
  // A document exit still stops capture via the pagehide handler above.
  document.addEventListener('visibilitychange', () => {if(!document.hidden)syncAudio();});
})();
