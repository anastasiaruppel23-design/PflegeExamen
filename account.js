let cloudClient = null;
let cloudUser = null;
let cloudReady = false;
let cloudTimer = null;
let cloudBusy = false;
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
  const next = requestedTab || 'start';
  requestedTab = null;
  accountNotice = '';
  accountError = false;

  const url = new URL(location.href);
  if (url.searchParams.get('bereich') === 'pruefungsformat') {
    url.searchParams.delete('bereich');
    history.replaceState(history.state, '', url);
  }

  if (tab === next) render();
  else go(next);

  loadCloudProgress(askAboutProgress);
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
      cloudUser = result.data.session.user;
      enterLearning(Boolean(localStorage.getItem('pflegekompass-v1')));
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
      <p id="cloudStatus" class="muted">Dein Lernstand wird bei Änderungen in der Cloud gespeichert.</p>
      <div class="flex">
        <button class="btn primary" onclick="syncCloudProgress()">Jetzt sichern</button>
        <button class="btn" onclick="loadCloudProgress(true)">Cloud-Lernstand laden</button>
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
  if (!hasLearningAccess() || !cloudClient || cloudBusy) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(syncCloudProgress, 1400);
}

async function syncCloudProgress() {
  if (!hasLearningAccess() || !cloudClient) return;
  const userId = cloudUser.id;
  try {
    const {error} = await cloudClient.from('learning_progress').upsert({
      user_id: userId, data: state, updated_at: new Date().toISOString()
    }, {onConflict: 'user_id'});
    if (error) throw error;
    if (cloudUser?.id === userId && $('#cloudStatus')) {
      $('#cloudStatus').textContent = 'Lernstand in der Cloud gespeichert.';
    }
  } catch (error) {
    if (cloudUser?.id === userId && $('#cloudStatus')) {
      $('#cloudStatus').textContent = 'Synchronisierung fehlgeschlagen. Der Lernstand ist lokal gespeichert.';
    }
  }
}

async function loadCloudProgress(ask = true) {
  if (!hasLearningAccess() || !cloudClient) return;
  const userId = cloudUser.id;
  const localProgress = localStorage.getItem('pflegekompass-v1');
  try {
    const {data, error} = await cloudClient.from('learning_progress')
      .select('data').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (cloudUser?.id !== userId) return;

    if (data?.data) {
      if (ask && !confirm('Gespeicherten Cloud-Lernstand auf diesem Gerät laden? Der lokale Lernstand wird ersetzt.')) return;
      if (!ask && localStorage.getItem('pflegekompass-v1') !== localProgress) return;
      cloudBusy = true;
      try {
        state = {...state, ...data.data};
        localStorage.setItem('pflegekompass-v1', JSON.stringify(state));
      } finally {
        cloudBusy = false;
      }
      if (tab === 'start' || tab === 'konto') render();
    } else if (ask && localProgress && confirm('Deinen lokalen Lernstand in dieses Konto hochladen?')) {
      await syncCloudProgress();
    }
  } catch (error) {
    if (cloudUser?.id === userId && $('#cloudStatus')) {
      $('#cloudStatus').textContent = 'Cloud-Lernstand konnte gerade nicht geladen werden.';
    }
  }
}
