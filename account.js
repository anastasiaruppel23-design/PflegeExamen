let cloudClient = null;
let cloudUser = null;
let cloudReady = false;
let cloudTimer = null;
let cloudBusy = false;
let cloudLocalSaved = true;
let progressOwner = null;
let progressDirty = false;
let progressVersion = 0;
let progressTask = null;
let progressLoading = null;
let cloudStatus = '';

function studyProgressDefaults(value = {}) {
  return {
    done: {}, best: 0, caseScores: {}, weakTopics: {}, reviewItems: {},
    kbMistakes: {}, kbMastered: {}, kbAttempts: 0,
    upgradeStats: {}, simResults: {}, challengeResults: {}, ...value
  };
}

const progressKey = user => 'pflegefokus-progress:'+user;

function switchProgressOwner(user) {
  if (progressOwner === user) return;
  clearTimeout(cloudTimer);
  let snapshot;
  try {
    if (user) {
      snapshot = JSON.parse(localStorage.getItem(progressKey(user)) || 'null');
      if (!snapshot && !localStorage.getItem('pflegefokus-legacy-owner')) {
        const previous = JSON.parse(localStorage.getItem('pflegekompass-v1') || '{}');
        const care = JSON.parse(localStorage.getItem('pflegefokus-care-practice') || '{}');
        snapshot = {data: {...previous, carePractice: care}, pending: false};
        localStorage.setItem('pflegefokus-legacy-owner', user);
      }
    }
  } catch {}
  progressOwner = user;
  progressVersion++;
  progressDirty = Boolean(snapshot?.pending);
  state = studyProgressDefaults(snapshot?.data);
  cloudStatus = progressDirty ? 'Auf diesem Gerät gespeichert. Synchronisierung ausstehend.' : '';
  if (user && snapshot) writeLocalProgress();
}

function writeLocalProgress() {
  if (!progressOwner) return;
  try {
    localStorage.setItem(progressKey(progressOwner), JSON.stringify({data:state,pending:progressDirty}));
    cloudLocalSaved = true;
  } catch {
    cloudLocalSaved = false;
    setCloudStatus('Lokales Speichern fehlgeschlagen. Lass die App offen und prüfe den Gerätespeicher.');
  }
}

function persistStudyProgress() {
  if (!hasLearningAccess() || !progressOwner) return;
  progressDirty = true;
  progressVersion++;
  writeLocalProgress();
  if (cloudLocalSaved) setCloudStatus('Auf diesem Gerät gespeichert. Synchronisierung ausstehend.');
}

function setCloudStatus(text) {
  cloudStatus = text;
  const status = document.querySelector('#cloudStatus');
  if (status) status.textContent = text;
}

function mergeAnswerDrafts(local = {}, remote = {}) {
  const merged = {...remote};
  for (const [key, draft] of Object.entries(local)) {
    if (!merged[key] || draft.updated >= merged[key].updated) merged[key] = draft;
  }
  return merged;
}
let publicMetrics = null;
let loadingPublicMetrics = false;

const authLink = new URLSearchParams(location.hash.slice(1));
let passwordRecovery = authLink.get('type') === 'recovery';
let requestedTab = new URLSearchParams(location.search).get('bereich') === 'pruefungsformat'
  ? 'pruefungsformat'
  : null;
let accountMode = authLink.has('error_code') ? 'login' : 'register';
let accountEmail = '';
let accountNotice = authLink.has('error_code')
  ? 'Dieser E-Mail-Link ist ungültig oder abgelaufen. Du kannst unten einen neuen Link anfordern.'
  : '';
let accountError = Boolean(accountNotice);
let accountSubmitting = false;

function hasLearningAccess() {
  return Boolean(cloudUser && !passwordRecovery);
}

function cloudConfigured() {
  const config = window.PFLEGEFOKUS_CLOUD;
  return Boolean(config && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.url || '')
    && /^(sb_publishable_|eyJ)/.test(config.anonKey || ''));
}

function initCloud() {
  if (cloudConfigured() && window.supabase) {
    try {
      const {url, anonKey} = window.PFLEGEFOKUS_CLOUD;
      cloudClient = window.supabase.createClient(url, anonKey, {
        auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}
      });
      cloudClient.auth.onAuthStateChange((event, session) => {
        // Leave the SDK's auth lock before routing or starting a database request.
        setTimeout(() => updateCloudSession(event, session), 0);
      });
      return;
    } catch (error) {
      cloudClient = null;
      console.warn('Cloud initialization failed', error);
    }
  }
  cloudReady = true;
  if (tab === 'konto') renderAccount();
}

function updateCloudSession(event, session) {
  const previousUser = cloudUser?.id;
  cloudUser = session?.user ?? null;
  if (previousUser !== cloudUser?.id || event === 'INITIAL_SESSION') {
    switchProgressOwner(cloudUser?.id ?? null);
    window.voiceAnswers?.setOwner(cloudUser?.id ?? null);
  }

  if (event === 'PASSWORD_RECOVERY' && cloudUser) {
    passwordRecovery = true;
    go('konto');
    return;
  }

  if (!cloudUser) {
    passwordRecovery = false;
    clearTimeout(cloudTimer);
    if (previousUser) {
      pauseTimer();
      document.querySelector('#studyGlossaryDialog[open]')?.close();
      go('start');
    }
  }

  if (event === 'INITIAL_SESSION') {
    cloudReady = true;
    refreshPublicMetrics();
  }

  if (cloudReady && hasLearningAccess() && !accountSubmitting
      && (event === 'INITIAL_SESSION' || cloudUser.id !== previousUser)) {
    enterLearning(false);
  } else if (event === 'INITIAL_SESSION' && tab === 'konto') {
    renderAccount();
  }
}

function enterLearning(askAboutProgress) {
  const savedTab = state.lastStudyTab;
  const knownRoute = menuGroups.some(([, , items]) => items.some(([id]) => id === savedTab));
  const next = requestedTab || (knownRoute ? savedTab : 'start');
  requestedTab = null;
  accountNotice = '';
  accountError = false;

  const url = new URL(location.href);
  if (url.searchParams.get('bereich') === 'pruefungsformat') {
    url.searchParams.delete('bereich');
    history.replaceState(history.state, '', url);
  }

  if (tab === next) render();
  else {
    // Restoring the route should not mark a new or offline session as a change.
    tab = next;
    render();
  }

  refreshCloudProgress(askAboutProgress);
  if (savedTab === next) {
    if (next === 'falltraining' && Number.isInteger(state.activeShortCase)) showExamCase(state.activeShortCase);
    if (next === 'faelle' && Number.isInteger(state.activeFullCase)) showCase(state.activeFullCase);
    if (next === 'faelle' && Number.isInteger(state.activeLinkedCase)) openStudyCase(state.activeLinkedCase);
    if (state.lastAnswer?.tab === tab) requestAnimationFrame(() => {
      const field = [...document.querySelectorAll('textarea[data-answer]')].find(item => item.dataset.answer === state.lastAnswer?.key);
      if (field) {
        if (field.closest('details')) field.closest('details').open = true;
        field.scrollIntoView({block:'center'});
      }
    });
  }
}

function openAccount(mode) {
  if (accountSubmitting) return;
  accountEmail = $('#accountEmail')?.value.trim() ?? accountEmail;
  accountMode = mode;
  accountNotice = '';
  accountError = false;
  go('konto');
}

function setAccountNotice(message, isError = false) {
  accountNotice = message;
  accountError = isError;
  const notice = $('#accountNotice');
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle('bad', isError);
}

function authErrorMessage(error) {
  const messages = {
    email_address_not_authorized: 'PflegeFokus kann derzeit keine Bestätigungsmail an diese Adresse senden.',
    email_not_confirmed: 'Bitte bestätige zuerst deine E-Mail-Adresse. Unten kannst du die Bestätigungsmail erneut anfordern.',
    invalid_credentials: 'E-Mail-Adresse oder Passwort stimmen nicht. Prüfe deine Eingaben.',
    over_email_send_rate_limit: 'Das Versandlimit für E-Mails ist erreicht. Versuche es später erneut.',
    over_request_rate_limit: 'Zu viele Anfragen. Warte kurz und versuche es erneut.',
    signup_disabled: 'Die Registrierung ist gerade geschlossen.',
    user_already_exists: 'Für diese E-Mail-Adresse gibt es bereits ein Konto. Wähle „Anmelden“ oder setze dein Passwort zurück.',
    weak_password: 'Wähle ein stärkeres Passwort mit mindestens 12 Zeichen.'
  };
  return messages[error.code] || (error.name === 'AuthRetryableFetchError'
    ? 'Die Verbindung ist unterbrochen. Prüfe dein Internet und versuche es erneut.'
    : 'Das hat gerade nicht geklappt. Bitte versuche es erneut.');
}

async function submitAccount(event) {
  event.preventDefault();
  if (accountSubmitting || !cloudClient) return;

  const form = event.currentTarget;
  const fields = form.querySelector('fieldset');
  const mode = accountMode;
  const email = $('#accountEmail').value.trim();
  const password = $('#accountPassword')?.value;
  const redirectTo = new URL('./', location.href).href;
  accountEmail = email;
  accountSubmitting = true;
  fields.disabled = true;
  setAccountNotice('');

  try {
    let result;
    switch (mode) {
      case 'register':
        result = await cloudClient.auth.signUp({email, password, options: {emailRedirectTo: redirectTo}});
        break;
      case 'resend':
        result = await cloudClient.auth.resend({type: 'signup', email, options: {emailRedirectTo: redirectTo}});
        break;
      case 'reset':
        result = await cloudClient.auth.resetPasswordForEmail(email, {redirectTo});
        break;
      default:
        result = await cloudClient.auth.signInWithPassword({email, password});
    }
    if (result.error) throw result.error;

    if (result.data?.session) {
      updateCloudSession('SIGNED_IN', result.data.session);
      enterLearning(false);
    } else if (mode === 'register' || mode === 'resend') {
      accountMode = 'login';
      accountNotice = 'Schau in deinem Postfach und im Spam-Ordner nach dem Bestätigungslink. Mit einer bereits bestätigten Adresse kannst du dich direkt anmelden.';
      if (tab === 'konto') renderAccount();
    } else if (mode === 'reset') {
      setAccountNotice('Falls es ein Konto zu dieser Adresse gibt, erhältst du einen Link zum Zurücksetzen. Schau auch im Spam-Ordner nach.');
    }
  } catch (error) {
    setAccountNotice(authErrorMessage(error), true);
  } finally {
    accountSubmitting = false;
    fields.disabled = false;
  }
}

async function updateAccountPassword(event) {
  event.preventDefault();
  if (accountSubmitting || !cloudClient) return;

  const fields = event.currentTarget.querySelector('fieldset');
  const password = $('#newPassword').value;
  if (password !== $('#repeatPassword').value) {
    setAccountNotice('Die Passwörter stimmen nicht überein.', true);
    return;
  }

  accountSubmitting = true;
  fields.disabled = true;
  setAccountNotice('');
  try {
    const {error} = await cloudClient.auth.updateUser({password});
    if (error) throw error;
    passwordRecovery = false;
    enterLearning(false);
  } catch (error) {
    setAccountNotice(authErrorMessage(error), true);
  } finally {
    accountSubmitting = false;
    fields.disabled = false;
  }
}

async function logoutAccount(button) {
  button.disabled = true;
  try {
    if (progressDirty && navigator.onLine) await syncCloudProgress();
    const {error} = await cloudClient.auth.signOut({scope: 'local'});
    if (error) throw error;
    accountEmail = '';
    accountMode = 'login';
    setAccountNotice('');
    updateCloudSession('SIGNED_OUT', null);
  } catch (error) {
    setAccountNotice(authErrorMessage(error), true);
    button.disabled = false;
  }
}

function renderAccount() {
  const content = $('#content');
  const notice = `<p id="accountNotice" class="${accountError ? 'bad' : ''}" role="status">${esc(accountNotice)}</p>`;
  if (!cloudReady) {
    content.innerHTML = '<div class="panel account-panel"><h1>Dein Konto</h1><p role="status">Anmeldung wird geladen …</p></div>';
    return;
  }
  if (!cloudClient) {
    content.innerHTML = '<div class="panel account-panel"><h1>Dein Konto</h1><p>Die Anmeldung ist gerade nicht erreichbar.</p><button class="btn primary" onclick="location.reload()">Seite neu laden</button></div>';
    return;
  }
  if (passwordRecovery && cloudUser) {
    content.innerHTML = `<div class="panel account-panel"><h1>Neues Passwort festlegen</h1>
      <form onsubmit="updateAccountPassword(event)"><fieldset>
        <label for="newPassword">Neues Passwort (mindestens 12 Zeichen)</label>
        <input id="newPassword" type="password" autocomplete="new-password" minlength="12" required>
        <label for="repeatPassword">Passwort wiederholen</label>
        <input id="repeatPassword" type="password" autocomplete="new-password" minlength="12" required>
        <button class="btn primary" type="submit">Passwort speichern</button>
      </fieldset>${notice}</form></div>`;
    return;
  }
  if (cloudUser) {
    content.innerHTML = `<div class="panel account-panel"><h1>Mein Konto</h1>
      <p>Angemeldet als <strong>${esc(cloudUser.email || 'Benutzerkonto')}</strong></p>
      <p id="cloudStatus" class="muted" role="status">${esc(cloudStatus || 'Dein Lernstand wird automatisch gespeichert und mit deinem Konto synchronisiert.')}</p>
      <div class="flex">
        <button class="btn primary" onclick="syncCloudProgress()">Jetzt sichern</button>
        <button class="btn" onclick="refreshCloudProgress(true)">Cloud-Lernstand laden</button>
        <button class="btn" onclick="logoutAccount(this)">Abmelden</button>
      </div>${notice}
      <p class="muted">Auf gemeinsam genutzten Geräten kann der lokale Lernstand nach der Abmeldung im Browser verbleiben.</p></div>`;
    return;
  }

  const labels = {
    register: ['Konto erstellen', 'Registrieren'],
    login: ['Bei PflegeFokus anmelden', 'Anmelden'],
    reset: ['Passwort zurücksetzen', 'Link zum Zurücksetzen senden'],
    resend: ['E-Mail-Adresse bestätigen', 'Bestätigungsmail senden']
  };
  const [title, submit] = labels[accountMode];
  const isRegistration = accountMode === 'register';
  const needsPassword = isRegistration || accountMode === 'login';
  content.innerHTML = `<div class="panel account-panel"><h1>${title}</h1>
    ${isRegistration ? '<p>Erstelle ein Konto, um Lernstoff, Lernkarten, Quiz und Prüfungstraining zu öffnen.</p>' : ''}
    <form onsubmit="submitAccount(event)"><fieldset>
      <label for="accountEmail">E-Mail-Adresse</label>
      <input id="accountEmail" name="email" type="email" autocomplete="email" autocapitalize="none" value="${esc(accountEmail)}" required>
      ${needsPassword ? `<label for="accountPassword">Passwort${isRegistration ? ' (mindestens 12 Zeichen)' : ''}</label>
        <input id="accountPassword" name="password" type="password" autocomplete="${isRegistration ? 'new-password' : 'current-password'}" ${isRegistration ? 'minlength="12"' : ''} required>` : ''}
      <button class="btn primary" type="submit">${submit}</button>
    </fieldset>${notice}</form>
    <div class="account-options">
      ${accountMode === 'login' ? '<button class="text-button" onclick="openAccount(\'register\')">Konto erstellen</button>' : '<button class="text-button" onclick="openAccount(\'login\')">Zur Anmeldung</button>'}
      ${accountMode !== 'reset' ? '<button class="text-button" onclick="openAccount(\'reset\')">Passwort vergessen?</button>' : ''}
      ${accountMode !== 'resend' ? '<button class="text-button" onclick="openAccount(\'resend\')">Bestätigungsmail erneut senden</button>' : ''}
    </div></div>`;
}

function renderPublicMetrics() {
  const visits = $('#publicVisits');
  const registrations = $('#publicRegistrations');
  if (!visits || !registrations || !publicMetrics) return;
  visits.textContent = Number(publicMetrics.visits).toLocaleString('de-DE');
  registrations.textContent = Number(publicMetrics.registrations).toLocaleString('de-DE');
}

async function refreshPublicMetrics() {
  if (!cloudClient || loadingPublicMetrics) return;
  loadingPublicMetrics = true;
  try {
    const key = 'pflegefokus-visit-counted-v1';
    if (!sessionStorage.getItem(key)) {
      const visit = await cloudClient.rpc('record_app_visit');
      if (visit.error) throw visit.error;
      sessionStorage.setItem(key, '1');
    }
    const result = await cloudClient.rpc('get_app_metrics');
    if (result.error) throw result.error;
    publicMetrics = Array.isArray(result.data) ? result.data[0] : result.data;
    renderPublicMetrics();
  } catch (error) {
    console.warn('Public metrics are not available yet', error);
  } finally {
    loadingPublicMetrics = false;
  }
}

function scheduleCloudSave() {
  if (!progressDirty || !hasLearningAccess() || !cloudClient || cloudBusy || !navigator.onLine) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(syncCloudProgress, 650);
}

async function syncCloudProgress() {
  if (!hasLearningAccess() || !cloudClient || !navigator.onLine) return;
  if (progressLoading) await progressLoading;
  if (!hasLearningAccess()) return;
  if (progressTask) {
    await progressTask;
    if (progressDirty) scheduleCloudSave();
    return;
  }
  const userId = cloudUser.id;
  const version = progressVersion;
  clearTimeout(cloudTimer);
  const data = JSON.parse(JSON.stringify(state));
  progressTask = (async () => {
    try {
      const {error} = await cloudClient.from('learning_progress').upsert({
        user_id: userId, data, updated_at: new Date().toISOString()
      }, {onConflict: 'user_id'});
      if (error) throw error;
      if (progressOwner !== userId) return;
      if (version === progressVersion) {
        progressDirty = false;
        setCloudStatus('Lernstand mit deinem Konto synchronisiert.');
        writeLocalProgress();
      } else scheduleCloudSave();
    } catch {
      if (progressOwner === userId) {
        setCloudStatus(cloudLocalSaved ? 'Der Lernstand ist auf diesem Gerät gespeichert. Die Synchronisierung steht noch aus.' : 'Der Lernstand konnte gerade nicht gespeichert werden.');
      }
    }
  })();
  try {await progressTask;} finally {progressTask = null;}
}

async function loadCloudProgress(ask = true) {
  if (!hasLearningAccess() || !cloudClient) return;
  const userId = cloudUser.id;
  const version = progressVersion;
  try {
    const {data, error} = await cloudClient.from('learning_progress')
      .select('data').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (cloudUser?.id !== userId) return;

    if (data?.data) {
      if (ask && !confirm('Gespeicherten Cloud-Lernstand auf diesem Gerät laden?')) return;
      cloudBusy = true;
      try {
        const changedHere = progressDirty || version !== progressVersion;
        const remote = data.data;
        const drafts = mergeAnswerDrafts(state.answerDrafts, remote.answerDrafts);
        const wasDirty = progressDirty;
        state = changedHere
          ? studyProgressDefaults({...remote, ...state, answerDrafts: drafts})
          : studyProgressDefaults({...state, ...remote, lastStudyTab: state.lastStudyTab || remote.lastStudyTab, answerDrafts: drafts});
        const draftChanges = Object.entries(drafts).some(([key, draft]) => !remote.answerDrafts?.[key] || draft.updated > remote.answerDrafts[key].updated);
        progressDirty = wasDirty || draftChanges;
        if (progressDirty) progressVersion++;
        writeLocalProgress();
      } finally {
        cloudBusy = false;
      }
      if (tab === 'start' || tab === 'konto') render();
      window.voiceAnswers?.refreshDrafts();
    } else if (ask && confirm('Deinen lokalen Lernstand in dieses Konto hochladen?')) {
      persistStudyProgress();
    }
  } catch {
    if (cloudUser?.id === userId) setCloudStatus('Cloud-Lernstand konnte gerade nicht geladen werden.');
  }
}

function refreshCloudProgress(ask = false) {
  const task = loadCloudProgress(ask);
  progressLoading = task;
  return task.finally(() => {
    if (progressLoading === task) progressLoading = null;
    if (progressDirty) scheduleCloudSave();
  });
}

function flushStudyProgress() {
  if (progressDirty) syncCloudProgress();
}
window.addEventListener('online', () => {
  if (progressDirty) refreshCloudProgress().finally(flushStudyProgress);
});
window.addEventListener('pagehide', flushStudyProgress);
document.addEventListener('visibilitychange', flushStudyProgress);
