(() => {
  const categories = {
    pruefungen: {name:'Prüfung & Lernfragen', icon:'book', description:'Fragen zum Lernstoff, zu Übungen und zur Prüfungsvorbereitung.'},
    praxis: {name:'Praxis & Fallbesprechung', icon:'plan', description:'Besprich fiktive Pflegefälle nach Einsatzbereich.'},
    lernpartner: {name:'Lernpartner finden', icon:'people', description:'Finde Azubis, mit denen du regelmäßig üben kannst.'},
    erfahrungen: {name:'Erfahrungen & Gefühle', icon:'pulse', description:'Teile, was dich im Pflegealltag beschäftigt, freut oder stolz macht.'}
  };
  const reasons = {datenschutz:'Erkennbare persönliche Angaben', umgangston:'Umgangston', spam:'Spam', sonstiges:'Sonstiges'};
  const topicFields = 'id,author_id,author_nickname,author_setting,category,care_setting,title,body,pinned,featured,hidden,created_at';
  const replyFields = 'id,author_id,author_nickname,author_setting,body,hidden,created_at';
  const pageSize = 16;
  let selectedCategory = 'pruefungen';
  let selectedSetting = '';
  let lastOwner = null;

  function forumError(error) {
    if (!navigator.onLine) return 'Für den Austausch brauchst du eine Internetverbindung.';
    if (error?.code === '23505') return 'Dieser Eintrag ist bereits vorhanden.';
    if (error?.code === '42501' || error?.status === 401) return 'Deine Anmeldung ist abgelaufen oder du hast für diese Aktion keine Berechtigung.';
    return 'Der Austausch ist gerade nicht erreichbar. Bitte versuche es erneut.';
  }

  function settingOptions(selected = '', empty = 'Ohne Einsatzbereich') {
    return `<option value="">${empty}</option>` + Object.entries(profileSettings).map(([id,name]) =>
      `<option value="${id}"${id === selected ? ' selected' : ''}>${esc(name)}</option>`).join('');
  }

  function forumAuthor(row) {
    const setting = Object.hasOwn(profileSettings,row.author_setting) ? row.author_setting : null;
    return `<p class="forum-byline">${setting ? settingAvatar(setting) : ''}<strong>${esc(row.author_nickname)}</strong>
      <time datetime="${esc(row.created_at)}">${new Intl.DateTimeFormat('de-DE',{dateStyle:'medium'}).format(new Date(row.created_at))}</time></p>`;
  }

  function forumProfile(user) {
    return cloudClient.from('forum_profiles')
      .select('nickname,postal_code,show_setting,avatar_setting').eq('user_id',user).maybeSingle();
  }

  window.syncForumAvatarSetting = async function (setting) {
    if (!hasLearningAccess() || !cloudClient) return;
    const avatar_setting = Object.hasOwn(profileSettings,setting) ? setting : null;
    try {
      await cloudClient.from('forum_profiles').update({avatar_setting})
        .eq('user_id',cloudUser.id).eq('show_setting',true);
    } catch {
      // The saved profile remains usable offline. Saving the forum profile retries syncing.
    }
  };

  window.mountForumProfile = function (root) {
    const user = cloudUser?.id;
    if (!root || !user || !hasLearningAccess()) return;
    const active = () => root.isConnected && cloudUser?.id === user && hasLearningAccess();
    root.innerHTML = `<h2 id="forumIdentityTitle">Dein Profil für den Austausch</h2>
      <p>Dein Nickname erscheint bei deinen Beiträgen. Deine freiwillige PLZ sehen nur du und die App-Leitung.</p>
      <form>
        <label for="forumNickname">Nickname</label>
        <input id="forumNickname" name="nickname" autocomplete="nickname" minlength="3" maxlength="24" required aria-describedby="forumNicknameHelp">
        <small id="forumNicknameHelp">3 bis 24 Zeichen. Buchstaben, Zahlen, Leerzeichen, Punkt, Bindestrich und Unterstrich sind möglich.</small>
        <label for="forumPostcode">PLZ (freiwillig)</label>
        <input id="forumPostcode" name="postal_code" autocomplete="postal-code" inputmode="numeric" maxlength="5" pattern="[0-9]{4,5}">
        <label class="forum-checkbox"><input type="checkbox" name="show_setting"> Mein Linien-Icon für den Einsatzbereich im Forum anzeigen</label>
        <button type="submit" class="btn primary" disabled>Speichern</button>
      </form>
      <p class="muted" role="status">Profil wird geladen …</p>`;
    const form = root.querySelector('form');
    const status = root.querySelector('[role="status"]');
    const submit = form.querySelector('button');
    async function load() {
      try {
        const {data,error} = await forumProfile(user);
        if (error) throw error;
        if (!active()) return;
        for (const field of ['nickname','postal_code']) form.elements[field].value = data?.[field] || '';
        form.elements.show_setting.checked = Boolean(data?.show_setting);
        submit.disabled = false;
        status.textContent = '';
      } catch (error) {
        if (active()) status.textContent = forumError(error);
      }
    }
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const nickname = form.elements.nickname.value.trim();
      if (!/^[\p{L}\p{N}][\p{L}\p{N} ._\-]{2,23}$/u.test(nickname)) {
        status.textContent = 'Beginne deinen Nickname mit einem Buchstaben oder einer Zahl und verwende 3 bis 24 erlaubte Zeichen.';
        form.elements.nickname.focus();
        return;
      }
      const setting = state.profileAppearance?.setting;
      submit.disabled = true;
      try {
        const {error} = await cloudClient.from('forum_profiles').upsert({
          user_id:user, nickname, postal_code:form.elements.postal_code.value.trim() || null,
          show_setting:form.elements.show_setting.checked,
          avatar_setting:Object.hasOwn(profileSettings,setting) ? setting : null
        }, {onConflict:'user_id'});
        if (error) throw error;
        if (active()) status.textContent = 'Dein Profil für den Austausch wurde gespeichert.';
      } catch (error) {
        if (active()) status.textContent = error?.code === '23505' ? 'Dieser Nickname ist bereits vergeben.' : forumError(error);
      } finally {
        if (active()) submit.disabled = false;
      }
    });
    load();
  };

  function renderReport(replyId = '') {
    return `<details class="forum-report"><summary>Melden</summary><form data-action="report" data-reply="${esc(replyId)}">
      <label>Grund <select name="reason" required><option value="">Bitte auswählen</option>${Object.entries(reasons).map(([id,name]) =>
        `<option value="${id}">${name}</option>`).join('')}</select></label>
      <button type="submit" class="btn">Meldung senden</button></form></details>`;
  }

  function messageControls(row, user, moderator, reply = false) {
    const prefix = reply ? 'reply' : 'topic';
    const fn = (action,text) => `<button type="button" class="btn" data-action="${action}-${prefix}" data-id="${esc(row.id)}">${text}</button>`;
    return `<div class="forum-controls">
      ${row.author_id === user ? fn('delete','Eigenen Beitrag löschen') : row.hidden ? '' : renderReport(reply ? row.id : '')}
      ${moderator ? fn('hide',row.hidden ? 'Wieder anzeigen' : 'Ausblenden') : ''}
      ${moderator && !reply ? fn('pin',row.pinned ? 'Anheftung lösen' : 'Anheften') : ''}
      ${moderator && !reply && row.category === 'praxis' ? fn('feature',row.featured ? 'Fall der Woche zurücknehmen' : 'Als Fall der Woche markieren') : ''}
    </div>`;
  }

  window.renderForum = function (content) {
    const user = cloudUser?.id;
    if (!user || !hasLearningAccess()) return;
    if (lastOwner !== user) {
      selectedCategory = 'pruefungen';
      selectedSetting = '';
      lastOwner = user;
    }
    let moderator = false;
    let profile = null;
    let topic = null;
    let replies = [];
    let page = 0;
    let replyPage = 0;
    let request = 0;
    content.innerHTML = `<section class="forum-page">
      <div class="learning-hero"><h2>Austausch</h2><p>Frag nach, teile Erfahrungen und lerne zusammen mit anderen Azubis.</p></div>
      <div class="forum-categories" aria-label="Forumsbereiche">${Object.entries(categories).map(([key,entry]) =>
        `<button type="button" class="forum-category" data-category="${key}" aria-pressed="false">${studyMini(entry.icon,'mini-small')}
          <span><strong>${entry.name}</strong><small>${entry.description}</small></span></button>`).join('')}</div>
      <p class="forum-status" role="status"></p>
      <div class="forum-main"></div>
      <aside class="forum-admin" hidden></aside>
    </section>`;
    const root = content.querySelector('.forum-page');
    const main = root.querySelector('.forum-main');
    const status = root.querySelector('[role="status"]');
    const admin = root.querySelector('.forum-admin');
    const active = () => root.isConnected && cloudUser?.id === user && hasLearningAccess();
    const privacyText = 'Verwende für Fallbesprechungen fiktive Beispiele. Lass Namen, Patientendaten und erkennbare Angaben zu Einrichtungen weg.';
    const profileLink = '<button type="button" class="btn" data-action="profile">Nickname im Profil eintragen</button>';
    const topicComposer = () => profile?.nickname ? `<details class="forum-compose"><summary>Beitrag schreiben</summary>
      <form data-action="new-topic">
        <p class="muted">${privacyText}</p>
        <label for="forumTitle">Titel</label><input id="forumTitle" name="title" minlength="5" maxlength="100" required>
        ${selectedCategory === 'praxis' ? `<label for="forumTopicSetting">Einsatzbereich des Falls</label><select id="forumTopicSetting" name="care_setting">${settingOptions(selectedSetting)}</select>` : ''}
        <label for="forumBody">Dein Beitrag</label><textarea id="forumBody" name="body" minlength="5" maxlength="3000" required></textarea>
        <button type="submit" class="btn primary">Beitrag veröffentlichen</button>
      </form></details>` : `<p>Mit einem Nickname kannst du eigene Beiträge und Antworten schreiben.</p>${profileLink}`;

    async function loadTopics() {
      const current = ++request;
      topic = null;
      const category = selectedCategory;
      status.textContent = 'Beiträge werden geladen …';
      main.innerHTML = '';
      root.querySelectorAll('[data-category]').forEach(button =>
        button.setAttribute('aria-pressed',String(button.dataset.category === category)));
      try {
        let query = cloudClient.from('forum_topics').select(topicFields).eq('category',category);
        if (!moderator) query = query.eq('hidden',false);
        if (category === 'praxis' && selectedSetting) query = query.eq('care_setting',selectedSetting);
        const {data,error} = await query.order('featured',{ascending:false}).order('pinned',{ascending:false})
          .order('created_at',{ascending:false}).order('id',{ascending:false}).range(page * pageSize,(page + 1) * pageSize);
        if (error) throw error;
        if (!active() || current !== request) return;
        status.textContent = '';
        main.innerHTML = `<section class="panel forum-panel"><h3>${categories[category].name}</h3>
          ${category === 'praxis' ? `<label for="forumSettingFilter">Einsatzbereich filtern</label><select id="forumSettingFilter">${settingOptions(selectedSetting,'Alle Einsatzbereiche')}</select>` : ''}
          ${topicComposer()}
          <div class="forum-list">${data?.length ? data.slice(0,pageSize).map(row => `<article class="forum-thread">
            ${row.featured ? '<span class="tag">Fall der Woche</span>' : row.pinned ? '<span class="tag">Angeheftet</span>' : ''}
            ${row.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}
            <h4><button class="forum-thread-title" type="button" data-action="open" data-id="${esc(row.id)}">${esc(row.title)}</button></h4>
            ${forumAuthor(row)}
            ${row.care_setting ? `<p class="muted">${esc(profileSettings[row.care_setting])}</p>` : ''}
          </article>`).join('') : '<p class="muted">Hier gibt es noch keine Beiträge.</p>'}</div>
          ${page || data?.length > pageSize ? `<div class="flex">
            ${page ? '<button type="button" class="btn" data-action="previous">Neuere Beiträge</button>' : ''}
            ${data?.length > pageSize ? '<button type="button" class="btn" data-action="next">Ältere Beiträge</button>' : ''}</div>` : ''}
        </section>`;
      } catch(error) {
        if (active() && current === request) status.textContent = forumError(error);
      }
    }

    async function loadTopic(id, reportReply) {
      const current = ++request;
      status.textContent = 'Beitrag wird geladen …';
      main.innerHTML = '';
      try {
        let detail = cloudClient.from('forum_topics').select(topicFields).eq('id',id);
        let comments = cloudClient.from('forum_replies').select(replyFields).eq('topic_id',id);
        if (!moderator) {
          detail = detail.eq('hidden',false);
          comments = comments.eq('hidden',false);
        }
        const [selected,response] = await Promise.all([detail.maybeSingle(),comments.order('created_at').order('id')
          .range(replyPage * pageSize,(replyPage + 1) * pageSize)]);
        if (selected.error || response.error) throw selected.error || response.error;
        if (!active() || current !== request) return;
        topic = selected.data;
        if (!topic) {
          await loadTopics();
          if (active()) status.textContent = 'Der Beitrag ist nicht mehr verfügbar.';
          return;
        }
        replies = response.data || [];
        status.textContent = '';
        main.innerHTML = `<section class="panel forum-panel">
          <button type="button" class="btn" data-action="back">Zur Übersicht</button>
          <article class="forum-detail"><h3 tabindex="-1">${esc(topic.title)}</h3>
          ${topic.featured ? '<span class="tag">Fall der Woche</span>' : ''}${topic.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}
          ${forumAuthor(topic)}<p class="forum-text">${esc(topic.body)}</p>${messageControls(topic,user,moderator)}</article>
          <h4>Antworten</h4><div class="forum-list">
          ${replies.slice(0,pageSize).map(row => `<article id="forum-reply-${esc(row.id)}" class="forum-thread" tabindex="-1">${forumAuthor(row)}
            ${row.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}<p class="forum-text">${esc(row.body)}</p>${messageControls(row,user,moderator,true)}</article>`).join('') || '<p class="muted">Noch keine Antworten.</p>'}</div>
          ${replyPage || replies.length > pageSize ? `<div class="flex">
            ${replyPage ? '<button type="button" class="btn" data-action="previous-reply">Vorherige Antworten</button>' : ''}
            ${replies.length > pageSize ? '<button type="button" class="btn" data-action="next-reply">Weitere Antworten</button>' : ''}</div>` : ''}
          ${topic.hidden ? '' : profile?.nickname ? `<form class="forum-reply" data-action="new-reply">
            <label for="forumReply">Deine Antwort</label><textarea id="forumReply" name="body" minlength="2" maxlength="2000" required></textarea>
            <button type="submit" class="btn primary">Antwort veröffentlichen</button></form>` : profileLink}
        </section>`;
        const focus = reportReply && document.getElementById('forum-reply-'+reportReply) || main.querySelector('h3');
        focus?.focus({preventScroll:true});
        focus?.scrollIntoView({block:'center',behavior:'instant'});
      } catch (error) {
        if (active() && current === request) status.textContent = forumError(error);
      }
    }

    async function loadModeration() {
      const output = admin.querySelector('.forum-moderation-items');
      if (!moderator || !output) return;
      output.textContent = 'Übersicht wird geladen …';
      try {
        const [reports,postcodes] = await Promise.all([
          cloudClient.from('forum_reports').select('id,topic_id,reply_id,reason').eq('handled',false)
            .order('created_at').limit(30),
          cloudClient.from('forum_profiles').select('postal_code').not('postal_code','is',null).limit(1000)
        ]);
        if (reports.error || postcodes.error) throw reports.error || postcodes.error;
        if (!active()) return;
        const counts = new Map();
        for (const {postal_code} of postcodes.data || []) counts.set(postal_code,(counts.get(postal_code) || 0)+1);
        output.innerHTML = `<h4>Offene Meldungen</h4>${(reports.data || []).map(report => `<div class="forum-thread">
          <strong>${esc(reasons[report.reason])}</strong> <span class="muted">${report.reply_id ? 'Antwort' : 'Beitrag'}</span>
          <div class="flex"><button type="button" class="btn" data-action="open" data-id="${esc(report.topic_id)}" data-reply="${esc(report.reply_id || '')}">Zum Beitrag</button>
          <button type="button" class="btn" data-action="handle" data-id="${esc(report.id)}">Als erledigt markieren</button></div></div>`).join('') || '<p>Keine offenen Meldungen.</p>'}
          <h4>Freiwillige PLZ-Angaben</h4>
          <ul>${[...counts].sort().map(([code,count]) => `<li>${esc(code)} · ${count} Profile</li>`).join('') || '<li>Keine Angaben vorhanden.</li>'}</ul>`;
      } catch (error) {
        if (active()) output.textContent = forumError(error);
      }
    }

    async function moderate(button) {
      const [action,type] = button.dataset.action.split('-');
      const id = button.dataset.id;
      const row = type === 'reply' ? replies.find(item => item.id === id) : topic;
      if (action !== 'handle' && !row) return;
      const table = action === 'handle' ? 'forum_reports' : type === 'reply' ? 'forum_replies' : 'forum_topics';
      const property = {hide:'hidden',pin:'pinned',feature:'featured',handle:'handled'}[action];
      button.disabled = true;
      try {
        let operation;
        if (action === 'delete') {
          if (!window.confirm(type === 'topic' ? 'Eigenen Beitrag einschließlich Antworten löschen?' : 'Eigene Antwort löschen?')) return;
          operation = cloudClient.from(table).delete();
        } else {
          operation = cloudClient.from(table).update({[property]:action === 'handle' || !row[property]});
        }
        const {error} = await operation.eq('id',id).select('id').single();
        if (error) throw error;
        if (!active()) return;
        if (action === 'handle') await loadModeration();
        else if (action === 'delete' && type === 'topic') await loadTopics();
        else if (topic) await loadTopic(topic.id);
      } catch (error) {
        if (active()) status.textContent = action === 'feature' && error?.code === '23505'
          ? 'Nimm die bisherige Markierung „Fall der Woche“ zurück, bevor du einen anderen Beitrag auswählst.' : forumError(error);
      } finally {
        if (button.isConnected) button.disabled = false;
      }
    }

    root.addEventListener('click',event => {
      const button = event.target.closest('button');
      if (!button || !active()) return;
      if (button.dataset.category) {
        selectedCategory = button.dataset.category;
        page = 0;
        loadTopics();
        return;
      }
      const action = button.dataset.action;
      if (action === 'profile') go('konto');
      if (action === 'back') loadTopics();
      if (action === 'open') { replyPage = 0; loadTopic(button.dataset.id,button.dataset.reply); }
      if (action === 'next' || action === 'previous') { page += action === 'next' ? 1 : -1; loadTopics(); }
      if (action === 'next-reply' || action === 'previous-reply') { replyPage += action === 'next-reply' ? 1 : -1; loadTopic(topic.id); }
      if (/^(hide|delete|pin|feature)-|^handle$/.test(action || '')) moderate(button);
    });
    root.addEventListener('change',event => {
      if (event.target.id === 'forumSettingFilter') { selectedSetting = event.target.value; page = 0; loadTopics(); }
    });
    root.addEventListener('submit',async event => {
      const form = event.target;
      if (!form.dataset.action) return;
      event.preventDefault();
      if (!active()) return;
      const action = form.dataset.action;
      const fields = new FormData(form);
      const currentTopic = topic?.id;
      const submit = form.querySelector('button[type=submit]');
      submit.disabled = true;
      try {
        let response;
        if (action === 'new-topic') {
          response = await cloudClient.from('forum_topics').insert({
            category:selectedCategory, care_setting:fields.get('care_setting') || null,
            title:fields.get('title').trim(), body:fields.get('body').trim()
          }).select('id').single();
        } else if (action === 'new-reply') {
          response = await cloudClient.from('forum_replies').insert({topic_id:currentTopic,body:fields.get('body').trim()});
        } else {
          response = await cloudClient.from('forum_reports').insert({topic_id:currentTopic,reply_id:form.dataset.reply || null,reason:fields.get('reason')});
        }
        if (response.error) throw response.error;
        if (!active() || !form.isConnected) return;
        if (action === 'new-topic') { replyPage = 0; await loadTopic(response.data.id); }
        else if (action === 'new-reply') { await loadTopic(currentTopic); }
        else { form.closest('details').open = false; status.textContent = 'Danke. Deine Meldung wurde an die Moderation gesendet.'; }
      } catch (error) {
        if (active() && form.isConnected) status.textContent = action === 'report' && error?.code === '23505'
          ? 'Du hast diesen Beitrag bereits gemeldet.' : error?.code === '23514'
            ? 'Prüfe, ob dein Text die angegebene Mindestlänge erfüllt.' : forumError(error);
      } finally {
        if (submit.isConnected) submit.disabled = false;
      }
    });

    async function initialize() {
      status.textContent = 'Austausch wird geladen …';
      try {
        const [person,role] = await Promise.all([forumProfile(user),
          cloudClient.from('forum_moderators').select('user_id').eq('user_id',user).maybeSingle()]);
        if (person.error || role.error) throw person.error || role.error;
        if (!active()) return;
        profile = person.data;
        moderator = Boolean(role.data);
        if (moderator) {
          admin.hidden = false;
          admin.innerHTML = '<details class="panel"><summary>Moderation und PLZ-Übersicht</summary><div class="forum-moderation-items"></div></details>';
          admin.querySelector('details').addEventListener('toggle',event => { if (event.target.open) loadModeration(); });
        }
        await loadTopics();
      } catch (error) {
        if (active()) status.textContent = forumError(error);
      }
    }
    initialize();
  };
})();
