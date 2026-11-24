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
        for (let detail = field.closest('details'); detail; detail = detail.parentElement.closest('details')) {
          detail.open = true;
        }
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

const profileAvatars = {
  pulse: 'Herz',
  book: 'Lernbuch',
  wound: 'Pflaster',
  shield: 'Schild',
  speech: 'Sprechblase',
  hands: 'Hände'
};
const profileSettings = {
  ambulant: 'Ambulante Pflege',
  akut: 'Akutversorgung im Krankenhaus',
  langzeit: 'Stationäre Langzeitpflege',
  paediatrie: 'Pädiatrie',
  tagespflege: 'Tagespflege',
  psychiatrie: 'Psychiatrie',
  reha: 'Rehabilitation'
};

function settingAvatar(setting) {
  return `<span class="setting-avatar-art" data-setting-avatar="${setting}" aria-hidden="true"></span>`;
}

const defaultProfileIcon = '<svg class="pf-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></svg>';
let profileRevision = 0;

function validProfilePhoto(src) {
  return typeof src === 'string' && src.length <= 120000 &&
    /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(src);
}

function profileMark(profile) {
  if (profile?.kind === 'setting' && Object.hasOwn(profileSettings, profile.setting)) {
    return settingAvatar(profile.setting);
  }
  if (profile?.kind === 'photo' && validProfilePhoto(profile.src)) {
    return `<img src="${profile.src}" alt="" decoding="async">`;
  }
  if (profile?.kind === 'avatar' && Object.hasOwn(profileAvatars, profile.avatar)) {
    return studyMini(profile.avatar);
  }
  return defaultProfileIcon;
}

function refreshProfileDisplay() {
  const profile = hasLearningAccess() ? state.profileAppearance : null;
  const mark = profileMark(profile);
  const toggle = document.querySelector('.account-toggle');
  if (toggle && (tab === 'konto' || tab === 'postfach')) toggle.setAttribute('aria-current', 'page');
  else toggle?.removeAttribute('aria-current');
  for (const target of document.querySelectorAll('#headerProfile, #profilePreview')) {
    if (target.innerHTML !== mark) target.innerHTML = mark;
  }
  document.querySelectorAll('[data-profile-avatar]').forEach(button => {
    button.setAttribute('aria-pressed', String(profile?.kind === 'avatar' && profile.avatar === button.dataset.profileAvatar));
  });
  document.querySelectorAll('[data-profile-setting]').forEach(button => {
    button.setAttribute('aria-pressed', String(profile?.setting === button.dataset.profileSetting));
  });
  const clearButton = document.querySelector('#clearProfileImage');
  if (clearButton) clearButton.hidden = !['avatar','photo','setting'].includes(profile?.kind);
  const useSetting = document.querySelector('#useProfileSettingAvatar');
  const clearSetting = document.querySelector('#clearProfileSetting');
  if (useSetting && clearSetting) {
    const hasSetting = Object.hasOwn(profileSettings, profile?.setting);
    useSetting.hidden = !hasSetting || profile.kind === 'setting';
    clearSetting.hidden = !hasSetting;
  }
}

function saveProfileAppearance(appearance) {
  if (!hasLearningAccess()) return;
  profileRevision++;
  const previousSetting = state.profileAppearance?.setting;
  state.profileAppearance = {setting:previousSetting, ...appearance, updated:Date.now()};
  save();
  refreshProfileDisplay();
  if (previousSetting !== state.profileAppearance.setting) {
    window.syncForumAvatarSetting?.(state.profileAppearance.setting);
  }
}

async function resizeProfilePhoto(file) {
  if (file.size > 12 * 1024 * 1024) throw new Error('Das Bild ist zu groß. Wähle ein Bild bis 12 MB.');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
    throw new Error('Wähle ein Foto im JPG-, PNG- oder WebP-Format.');
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    if (!side) throw new Error('Das Bild ist leer.');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = Math.min(288, side);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Die Bildbearbeitung ist in diesem Browser gerade nicht verfügbar.');
    ctx.fillStyle = '#fff9ef';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2,
      side, side, 0, 0, canvas.width, canvas.height);
    const compressed = canvas.toDataURL('image/jpeg', 0.83);
    if (!validProfilePhoto(compressed)) throw new Error('Das Bild konnte nicht verkleinert werden.');
    return compressed;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function bindProfileEditor() {
  const editor = document.querySelector('#profileEditor');
  const uploader = editor.querySelector('#profilePhoto');
  const status = editor.querySelector('#profileNotice');
  editor.querySelectorAll('[data-profile-avatar]').forEach(button => {
    button.addEventListener('click', () => {
      saveProfileAppearance({kind:'avatar', avatar:button.dataset.profileAvatar});
      status.textContent = 'Avatar übernommen.';
    });
  });
  const useSettingAvatar = editor.querySelector('#useProfileSettingAvatar');
  const clearSetting = editor.querySelector('#clearProfileSetting');
  editor.querySelectorAll('[data-profile-setting]').forEach(button => {
    button.addEventListener('click', () => {
      const setting = button.dataset.profileSetting;
      const profile = state.profileAppearance;
      const keepPhoto = profile?.kind === 'photo';
      saveProfileAppearance(keepPhoto ? {kind:'photo', src:profile.src, setting} : {kind:'setting', setting});
      status.textContent = keepPhoto ? 'Einsatzbereich gespeichert.' : 'Einsatzbereich und passender Avatar übernommen.';
    });
  });
  useSettingAvatar.addEventListener('click', () => {
    const setting = state.profileAppearance?.setting;
    if (!Object.hasOwn(profileSettings, setting)) return;
    saveProfileAppearance({kind:'setting', setting});
    editor.querySelector(`[data-profile-setting="${setting}"]`).focus();
    status.textContent = 'Passender Avatar übernommen.';
  });
  clearSetting.addEventListener('click', () => {
    const profile = state.profileAppearance;
    const appearance = profile.kind === 'setting' ? {kind:'default'} : profile;
    saveProfileAppearance({...appearance, setting:null});
    editor.querySelector('[data-profile-setting]').focus();
    status.textContent = 'Einsatzbereich entfernt.';
  });
  editor.querySelector('#clearProfileImage').addEventListener('click', () => {
    saveProfileAppearance({kind:'default'});
    editor.querySelector('#chooseProfilePhoto').focus();
    status.textContent = 'Profilbild entfernt.';
  });
  editor.querySelector('#chooseProfilePhoto').addEventListener('click', () => uploader.click());
  uploader.addEventListener('change', async () => {
    const file = uploader.files[0];
    if (!file) return;
    uploader.value = '';
    const owner = cloudUser?.id;
    const revision = ++profileRevision;
    status.textContent = 'Foto wird vorbereitet …';
    try {
      const src = await resizeProfilePhoto(file);
      if (owner !== cloudUser?.id || revision !== profileRevision || !hasLearningAccess()) return;
      saveProfileAppearance({kind:'photo', src});
      status.textContent = 'Profilfoto übernommen.';
    } catch (error) {
      if (owner === cloudUser?.id && revision === profileRevision) {
        status.textContent = error instanceof DOMException ? 'Das Foto konnte nicht geöffnet werden. Wähle eine andere Datei.' : error.message;
      }
    }
  });
  refreshProfileDisplay();
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
    content.innerHTML = `<div class="panel account-panel">
      <div class="account-heading">
        <span class="profile-mark" id="profilePreview" aria-hidden="true"></span>
        <div><h1>Dein Profil</h1><p>${esc(cloudUser.email || 'Benutzerkonto')}</p></div>
      </div>
      <section id="profileEditor" class="profile-editor" aria-labelledby="profileEditorTitle">
        <h2 id="profileEditorTitle">Profilbild</h2>
        <p class="muted" id="profileImageHelp">Dein Profilbild ist nur in deinem Konto sichtbar.</p>
        <div class="flex">
          <button type="button" class="btn primary" id="chooseProfilePhoto" aria-describedby="profileImageHelp">Eigenes Foto auswählen</button>
          <input type="file" id="profilePhoto" aria-label="Profilfoto auswählen" accept="image/jpeg,image/png,image/webp" hidden>
          <button type="button" class="btn" id="clearProfileImage" hidden>Profilbild entfernen</button>
        </div>
        <fieldset class="profile-avatar-options">
          <legend>Dein Einsatzbereich</legend>
          <div class="profile-setting-grid">${Object.entries(profileSettings).map(([setting,label]) =>
            `<button type="button" class="profile-setting" data-profile-setting="${setting}" aria-pressed="false">${settingAvatar(setting)}<span>${label}</span></button>`).join('')}</div>
          <div class="flex profile-setting-actions">
            <button type="button" class="btn" id="useProfileSettingAvatar" hidden>Passenden Avatar verwenden</button>
            <button type="button" class="btn" id="clearProfileSetting" hidden>Einsatzbereich entfernen</button>
          </div>
        </fieldset>
        <details class="profile-avatar-options">
          <summary>Weitere Avatare</summary>
          <div class="profile-avatar-grid">${Object.entries(profileAvatars).map(([icon,label]) =>
            `<button type="button" class="profile-avatar" data-profile-avatar="${icon}" aria-pressed="false">${studyMini(icon,'mini-small')}<span>${label}</span></button>`).join('')}</div>
        </details>
        <p id="profileNotice" class="muted" role="status"></p>
      </section>
      <section id="forumIdentity" class="profile-editor forum-identity" aria-labelledby="forumIdentityTitle"></section>
      <h2 class="account-progress-heading">Dein Lernstand</h2>
      <p id="cloudStatus" class="muted" role="status">${esc(cloudStatus || 'Dein Lernstand wird automatisch gespeichert und mit deinem Konto synchronisiert.')}</p>
      <div class="flex">
        <button class="btn primary" onclick="syncCloudProgress()">Jetzt sichern</button>
        <button class="btn" onclick="refreshCloudProgress(true)">Cloud-Lernstand laden</button>
        <button class="btn" onclick="logoutAccount(this)">Abmelden</button>
      </div>${notice}
      <p class="muted">Auf gemeinsam genutzten Geräten kann der lokale Lernstand nach der Abmeldung im Browser verbleiben.</p></div>`;
    bindProfileEditor();
    window.mountForumProfile?.(document.querySelector('#forumIdentity'));
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
        const localProfile = state.profileAppearance;
        const remoteProfile = remote.profileAppearance;
        const localProfileNewer = (localProfile?.updated ?? 0) > (remoteProfile?.updated ?? 0);
        const profileAppearance = localProfileNewer ? localProfile : remoteProfile;
        const wasDirty = progressDirty;
        state = changedHere
          ? studyProgressDefaults({...remote, ...state, answerDrafts: drafts, profileAppearance})
          : studyProgressDefaults({...state, ...remote, lastStudyTab: state.lastStudyTab || remote.lastStudyTab, answerDrafts: drafts, profileAppearance});
        const draftChanges = Object.entries(drafts).some(([key, draft]) => !remote.answerDrafts?.[key] || draft.updated > remote.answerDrafts[key].updated);
        progressDirty = wasDirty || draftChanges || localProfileNewer;
        if (progressDirty) progressVersion++;
        writeLocalProgress();
      } finally {
        cloudBusy = false;
      }
      if (tab === 'start') render();
      refreshProfileDisplay();
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
