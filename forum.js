(() => {
  const categories = {
    pruefungen: {name:'Prüfung & Lernfragen', icon:'book', description:'Fragen zum Lernstoff, zu Übungen und zur Prüfungsvorbereitung.'},
    praxis: {name:'Praxis & Fallbesprechung', icon:'plan', description:'Besprich fiktive Pflegefälle nach Einsatzbereich.'},
    lernpartner: {name:'Lernpartner finden', icon:'people', description:'Finde Azubis, mit denen du regelmäßig üben kannst.'},
    erfahrungen: {name:'Erfahrungen & Gefühle', icon:'pulse', description:'Teile, was dich im Pflegealltag beschäftigt, freut oder stolz macht.'},
    feedback: {name:'Feedback & Wunschthemen', icon:'speech', description:'Teile Anregungen, Verbesserungsvorschläge und Ideen für neue Lerninhalte.'}
  };
  const reasons = {datenschutz:'Erkennbare persönliche Angaben', umgangston:'Umgangston', spam:'Spam', sonstiges:'Sonstiges'};
  const topicFields = 'id,author_id,author_nickname,author_setting,category,care_setting,title,body,pinned,featured,hidden,created_at';
  const overviewFields = topicFields + ',reply_count,latest_at,unread';
  const replyFields = 'id,author_id,author_nickname,author_setting,body,hidden,created_at,parent_reply_id';
  const dateTime = new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'});
  let indicatorOwner = null;
  let forumCounts = {};
  let mailCount = 0;
  let indicatorRequest = 0;
  let lastIndicatorCheck = 0;
  let pendingRecipient = null;

  const badge = (kind,label) => `<span class="forum-badge" data-forum-counter="${kind}" data-count-label="${label}" hidden></span>`;

  function displayIndicators() {
    const forumTotal = Object.values(forumCounts).reduce((sum,count) => sum + count,0);
    const counters = {...forumCounts,mail:mailCount,forum:forumTotal};
    for (const node of document.querySelectorAll('[data-forum-counter]')) {
      const count = counters[node.dataset.forumCounter] || 0;
      node.hidden = !count;
      node.textContent = count;
      node.setAttribute('aria-label',`${count} ${node.dataset.countLabel}`);
    }
    const menu = document.querySelector('#menuToggle');
    if (forumTotal) menu?.setAttribute('aria-label',`Menü, ${forumTotal} ungelesene Themen im Austausch`);
    else menu?.removeAttribute('aria-label');
    const profileButton = document.querySelector('.account-toggle');
    profileButton?.setAttribute('aria-label',mailCount
      ? `Profil und Konto, ${mailCount} ungelesene Nachrichten` : 'Profil und Konto');
  }

  window.refreshForumIndicators = async function (force = false) {
    const user = hasLearningAccess() ? cloudUser?.id : null;
    if (user !== indicatorOwner) {
      indicatorOwner = user;
      forumCounts = {};
      mailCount = 0;
      lastIndicatorCheck = 0;
      indicatorRequest++;
    }
    displayIndicators();
    if (!user || !cloudClient || (!force && Date.now() - lastIndicatorCheck < 15000)) return;
    const request = ++indicatorRequest;
    lastIndicatorCheck = Date.now();
    try {
      const [forums,mail] = await Promise.all([
        cloudClient.from('forum_unread_counts').select('category,unread_count'),
        cloudClient.from('forum_messages').select('id',{head:true,count:'exact'})
          .eq('recipient_id',user).is('read_at',null)
      ]);
      if (request !== indicatorRequest || cloudUser?.id !== user || !hasLearningAccess()) return;
      if (!forums.error) forumCounts = Object.fromEntries((forums.data || []).map(row => [row.category,Number(row.unread_count)]));
      const previousMailCount = mailCount;
      if (!mail.error) mailCount = mail.count || 0;
      displayIndicators();
      if (mailCount > previousMailCount) {
        document.querySelector('.forum-inbox')?.dispatchEvent(new Event('forum-mail-change'));
      }
    } catch {
      // Retain the last known counts until the connection is available again.
    }
  };

  window.addEventListener('online',() => window.refreshForumIndicators(true));
  document.addEventListener('visibilitychange',() => {
    if (!document.hidden) window.refreshForumIndicators(true);
  });
  window.setInterval(() => {
    if (!document.hidden) window.refreshForumIndicators();
  },30000);

  window.openForumInbox = function (recipient = null) {
    pendingRecipient = recipient ? {id:recipient,owner:cloudUser?.id} : null;
    go('postfach');
  };
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

  function forumTime(value) {
    return `<time datetime="${esc(value)}">${dateTime.format(new Date(value))}</time>`;
  }

  function forumAuthor(row) {
    const setting = Object.hasOwn(profileSettings,row.author_setting) ? row.author_setting : null;
    return `<p class="forum-byline">${setting ? settingAvatar(setting) : ''}<strong>${esc(row.author_nickname)}</strong>
      ${forumTime(row.created_at)}</p>`;
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
      <button type="button" class="btn forum-mail-entry">${studyMini('speech','mini-small')}<span>Mein Postfach</span>${badge('mail','ungelesene Nachrichten')}</button>
      <p>Dein Nickname erscheint bei deinen Beiträgen und im Postfach. Deine freiwillige PLZ sehen nur du und die App-Leitung.</p>
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
    root.querySelector('.forum-mail-entry').addEventListener('click',() => window.openForumInbox());
    displayIndicators();
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
      ${row.author_id !== user && !row.hidden ? `<button type="button" class="btn" data-action="message" data-recipient="${esc(row.author_id)}">Privat schreiben</button>` : ''}
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
    let unreadOnly = false;
    content.innerHTML = `<section class="forum-page">
      <div class="learning-hero forum-header">
        <div><h2>Austausch</h2><p>Frag nach, teile Erfahrungen und lerne zusammen mit anderen Azubis.</p></div>
        <button type="button" class="btn forum-mail-entry" data-action="inbox">${studyMini('speech','mini-small')}<span>Mein Postfach</span>${badge('mail','ungelesene Nachrichten')}</button>
      </div>
      <div class="forum-workspace">
        <nav class="forum-categories" aria-label="Forumsbereiche">${Object.entries(categories).map(([key,entry]) =>
          `<button type="button" class="forum-category" data-category="${key}" aria-pressed="false">${studyMini(entry.icon,'mini-small')}
            <strong>${entry.name}</strong>${badge(key,'ungelesene Themen')}</button>`).join('')}</nav>
        <div class="forum-content"><p class="forum-status" role="status"></p><div class="forum-main"></div></div>
      </div>
      <aside class="forum-admin" hidden></aside>
    </section>`;
    displayIndicators();
    const root = content.querySelector('.forum-page');
    const main = root.querySelector('.forum-main');
    const status = root.querySelector('[role="status"]');
    const admin = root.querySelector('.forum-admin');
    const active = () => root.isConnected && cloudUser?.id === user && hasLearningAccess();
    const privacyText = 'Verwende für Fallbesprechungen fiktive Beispiele. Lass Namen, Patientendaten und erkennbare Angaben zu Einrichtungen weg.';
    const profileLink = '<button type="button" class="btn" data-action="profile">Nickname im Profil eintragen</button>';
    const replyForm = (reply = null) => {
      const field = reply ? `forumReply-${esc(reply.id)}` : 'forumReply';
      return `<form class="forum-reply" data-action="new-reply" data-parent="${reply ? esc(reply.id) : ''}">
        <label for="${field}">${reply ? `Antwort an ${esc(reply.author_nickname)}` : 'Deine Antwort'}</label>
        <textarea id="${field}" name="body" data-voice-reply="forum-${esc(topic.id)}-${reply ? esc(reply.id) : 'topic'}" minlength="2" maxlength="2000" required></textarea>
        <button type="submit" class="btn primary">Antwort veröffentlichen</button>
      </form>`;
    };
    const topicComposer = () => profile?.nickname ? `<details class="forum-compose"><summary>Beitrag schreiben</summary>
      <form data-action="new-topic">
        <p class="muted">${selectedCategory === 'feedback'
          ? 'Beschreibe kurz, was du dir wünschst oder wo dir in der App etwas fehlt.' : privacyText}</p>
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
        let query = cloudClient.from('forum_topic_overview').select(overviewFields).eq('category',category);
        if (!moderator) query = query.eq('hidden',false);
        if (unreadOnly) query = query.eq('unread',true);
        if (category === 'praxis' && selectedSetting) query = query.eq('care_setting',selectedSetting);
        const {data,error} = await query.order('featured',{ascending:false}).order('pinned',{ascending:false})
          .order('latest_at',{ascending:false}).order('id',{ascending:false}).range(page * pageSize,(page + 1) * pageSize);
        if (error) throw error;
        if (!active() || current !== request) return;
        status.textContent = '';
        main.innerHTML = `<section class="panel forum-panel">
          <div class="forum-list-head">
            <div><h3>${categories[category].name}</h3><p>${categories[category].description}</p></div>
          </div>
          <div class="forum-toolbar">
            <button class="btn" type="button" data-action="refresh">${studyMini('repeat','mini-small')} Liste aktualisieren</button>
            <label class="forum-checkbox"><input type="checkbox" id="forumUnreadOnly"${unreadOnly ? ' checked' : ''}> Nur ungelesene Themen</label>
          </div>
          ${category === 'praxis' ? `<label for="forumSettingFilter">Einsatzbereich filtern</label><select id="forumSettingFilter">${settingOptions(selectedSetting,'Alle Einsatzbereiche')}</select>` : ''}
          ${topicComposer()}
          <div class="forum-list">${data?.length ? data.slice(0,pageSize).map(row => `<article class="forum-thread forum-topic-row${row.unread ? ' forum-unread' : ''}">
            <div class="forum-topic-tags">
              ${row.unread ? '<span class="forum-badge">Neu</span>' : ''}
              ${row.featured ? '<span class="tag">Fall der Woche</span>' : row.pinned ? '<span class="tag">Angeheftet</span>' : ''}
              ${row.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}
              ${row.care_setting ? `<span class="tag">${esc(profileSettings[row.care_setting])}</span>` : ''}
            </div>
            <h4><button class="forum-thread-title" type="button" data-action="open" data-id="${esc(row.id)}">${esc(row.title)}</button></h4>
            <div class="forum-topic-meta">${forumAuthor(row)}
              <p><strong>${Number(row.reply_count)} ${Number(row.reply_count) === 1 ? 'Antwort' : 'Antworten'}</strong>
                <span>Zuletzt aktiv ${forumTime(row.latest_at)}</span></p>
            </div>
          </article>`).join('') : `<p class="forum-empty">${unreadOnly ? 'Hier sind alle Themen gelesen.' : 'Hier gibt es noch keine Beiträge.'}</p>`}</div>
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
        let detail = cloudClient.from('forum_topic_overview').select(overviewFields).eq('id',id);
        let comments = cloudClient.from('forum_replies').select(replyFields).eq('topic_id',id);
        if (!moderator) {
          detail = detail.eq('hidden',false);
          comments = comments.eq('hidden',false);
        }
        const [selected,response] = await Promise.all([detail.maybeSingle(),comments.order('created_at',{ascending:false})
          .order('id',{ascending:false}).range(replyPage * pageSize,(replyPage + 1) * pageSize)]);
        if (selected.error || response.error) throw selected.error || response.error;
        if (!active() || current !== request) return;
        topic = selected.data;
        if (!topic) {
          await loadTopics();
          if (active()) status.textContent = 'Der Beitrag ist nicht mehr verfügbar.';
          return;
        }
        replies = response.data || [];
        const parentIds = [...new Set(replies.slice(0,pageSize).map(row => row.parent_reply_id).filter(Boolean))];
        const extraIds = reportReply && !replies.some(row => row.id === reportReply) ? [reportReply] : [];
        const parents = new Map();
        if (parentIds.length || extraIds.length) {
          let context = cloudClient.from('forum_replies').select(replyFields).eq('topic_id',id).in('id',[...new Set([...parentIds,...extraIds])]);
          if (!moderator) context = context.eq('hidden',false);
          const extra = await context;
          if (!active() || current !== request) return;
          for (const row of extra.data || []) {
            if (!row.hidden) parents.set(row.id,row.author_nickname);
            if (extraIds.includes(row.id)) replies = [row,...replies];
          }
        }
        const renderReply = row => `<article id="forum-reply-${esc(row.id)}" class="forum-thread" tabindex="-1">
          ${row.parent_reply_id ? `<p class="forum-reply-reference">${parents.has(row.parent_reply_id)
            ? `Antwort an ${esc(parents.get(row.parent_reply_id))}` : 'Antwort auf einen früheren Beitrag'}</p>` : ''}
          ${forumAuthor(row)}
          ${row.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}<p class="forum-text">${esc(row.body)}</p>
          ${!topic.hidden && !row.hidden && profile?.nickname ? `<details class="forum-direct-reply"><summary>Direkt antworten</summary>${replyForm(row)}</details>` : ''}
          ${messageControls(row,user,moderator,true)}
        </article>`;
        status.textContent = '';
        main.innerHTML = `<section class="panel forum-panel">
          <button type="button" class="btn" data-action="back">Zur Übersicht</button>
          <article class="forum-detail"><h3 tabindex="-1">${esc(topic.title)}</h3>
          ${topic.featured ? '<span class="tag">Fall der Woche</span>' : ''}${topic.hidden ? '<span class="tag">Ausgeblendet</span>' : ''}
          ${forumAuthor(topic)}<p class="forum-text">${esc(topic.body)}</p>${messageControls(topic,user,moderator)}</article>
          ${topic.hidden ? '' : profile?.nickname ? replyForm() : profileLink}
          <h4>Antworten</h4><div class="forum-list">
          ${replies.slice(0,pageSize).reverse().map(renderReply).join('') || '<p class="forum-empty">Noch keine Antworten.</p>'}</div>
          ${replyPage || (response.data || []).length > pageSize ? `<div class="flex">
            ${replyPage ? '<button type="button" class="btn" data-action="previous-reply">Neuere Antworten</button>' : ''}
            ${(response.data || []).length > pageSize ? '<button type="button" class="btn" data-action="next-reply">Ältere Antworten</button>' : ''}</div>` : ''}
        </section>`;
        const focus = reportReply && document.getElementById('forum-reply-'+reportReply) || main.querySelector('h3');
        focus?.focus({preventScroll:true});
        focus?.scrollIntoView({block:'center',behavior:'instant'});
        if (topic.unread && !topic.hidden) {
          const seen = await cloudClient.from('forum_topic_reads').upsert({
            user_id:user,topic_id:id,seen_at:topic.latest_at
          },{onConflict:'user_id,topic_id'});
          if (!seen.error && active()) window.refreshForumIndicators(true);
        }
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
      if (action === 'inbox') window.openForumInbox();
      if (action === 'message') window.openForumInbox(button.dataset.recipient);
      if (action === 'back') loadTopics();
      if (action === 'refresh') { page = 0; loadTopics(); window.refreshForumIndicators(true); }
      if (action === 'open') { replyPage = 0; loadTopic(button.dataset.id,button.dataset.reply); }
      if (action === 'next' || action === 'previous') { page += action === 'next' ? 1 : -1; loadTopics(); }
      if (action === 'next-reply' || action === 'previous-reply') { replyPage += action === 'next-reply' ? 1 : -1; loadTopic(topic.id); }
      if (/^(hide|delete|pin|feature)-|^handle$/.test(action || '')) moderate(button);
    });
    root.addEventListener('change',event => {
      if (event.target.id === 'forumSettingFilter') { selectedSetting = event.target.value; page = 0; loadTopics(); }
      if (event.target.id === 'forumUnreadOnly') { unreadOnly = event.target.checked; page = 0; loadTopics(); }
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
          response = await cloudClient.from('forum_replies').insert({
            topic_id:currentTopic,parent_reply_id:form.dataset.parent || null,body:fields.get('body').trim()
          }).select('id').single();
        } else {
          response = await cloudClient.from('forum_reports').insert({topic_id:currentTopic,reply_id:form.dataset.reply || null,reason:fields.get('reason')});
        }
        if (response.error) throw response.error;
        if (!active() || !form.isConnected) return;
        if (action === 'new-topic') { replyPage = 0; await loadTopic(response.data.id); }
        else if (action === 'new-reply') { replyPage = 0; await loadTopic(currentTopic,response.data.id); }
        else { form.closest('details').open = false; status.textContent = 'Danke. Deine Meldung wurde an die Moderation gesendet.'; }
      } catch (error) {
        if (active() && form.isConnected) status.textContent = action === 'report' && error?.code === '23505'
          ? 'Du hast diesen Beitrag bereits gemeldet.' : error?.code === '23503' && action === 'new-reply'
            ? 'Die Antwort, auf die du dich beziehst, ist nicht mehr verfügbar.' : error?.code === '23514'
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

  window.renderForumInbox = function (content) {
    const user = cloudUser?.id;
    if (!user || !hasLearningAccess()) return;
    const target = pendingRecipient?.owner === user ? pendingRecipient.id : null;
    pendingRecipient = null;
    let partner = null;
    let conversationPage = 0;
    let messagePage = 0;
    let listRequest = 0;
    let threadRequest = 0;
    let searchRequest = 0;
    const inboxPageSize = 24;
    content.innerHTML = `<section class="forum-page forum-inbox">
      <div class="learning-hero forum-header"><div><h2>Mein Postfach</h2>
        <p>Private Nachrichten zwischen zwei PflegeFokus-Mitgliedern.</p></div>
        <button type="button" class="btn" data-inbox-action="profile">Zum Profil</button>
      </div>
      <p class="forum-status" role="status"></p>
      <div class="forum-workspace inbox-workspace">
        <section class="panel inbox-conversations">
          <h3>Unterhaltungen ${badge('mail','ungelesene Nachrichten')}</h3>
          <form class="inbox-search">
            <label for="inboxNickname">Nickname suchen</label>
            <div><input id="inboxNickname" name="nickname" minlength="2" maxlength="24" required>
              <button type="submit" class="btn">Suchen</button></div>
          </form>
          <div class="inbox-search-results" aria-live="polite"></div>
          <div class="inbox-list"></div>
        </section>
        <section class="panel inbox-thread" aria-label="Unterhaltung">
          <p class="forum-empty">Wähle eine Unterhaltung oder suche nach einem Nickname.</p>
        </section>
      </div>
    </section>`;
    const root = content.querySelector('.forum-inbox');
    const status = root.querySelector('[role="status"]');
    const thread = root.querySelector('.inbox-thread');
    const list = root.querySelector('.inbox-list');
    const results = root.querySelector('.inbox-search-results');
    const active = () => root.isConnected && cloudUser?.id === user && hasLearningAccess();
    const isUuid = value => /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
    displayIndicators();

    async function loadConversations() {
      const request = ++listRequest;
      try {
        const {data,error} = await cloudClient.from('forum_conversations')
          .select('partner_id,nickname,latest_at,preview,sent,unread_count')
          .order('latest_at',{ascending:false}).order('partner_id')
          .range(conversationPage * inboxPageSize,(conversationPage + 1) * inboxPageSize);
        if (error) throw error;
        if (!active() || request !== listRequest) return;
        list.innerHTML = (data || []).slice(0,inboxPageSize).map(row => `<button type="button" class="inbox-contact${row.unread_count ? ' forum-unread' : ''}"
          data-inbox-action="open" data-recipient="${esc(row.partner_id)}"${partner?.id === row.partner_id ? ' aria-current="true"' : ''}>
          <span><strong>${esc(row.nickname)}</strong>${row.unread_count ? `<span class="forum-badge" aria-label="${Number(row.unread_count)} ungelesene Nachrichten">${Number(row.unread_count)}</span>` : ''}</span>
          <span class="inbox-preview">${row.sent ? 'Du: ' : ''}${esc(row.preview)}</span>
          ${forumTime(row.latest_at)}
        </button>`).join('') || '<p class="forum-empty">Dein Postfach ist noch leer.</p>';
        if (conversationPage || data?.length > inboxPageSize) list.insertAdjacentHTML('beforeend',`<div class="flex">
          ${conversationPage ? '<button type="button" class="btn" data-inbox-action="previous-list">Neuere</button>' : ''}
          ${data?.length > inboxPageSize ? '<button type="button" class="btn" data-inbox-action="next-list">Weitere</button>' : ''}
        </div>`);
      } catch (error) {
        if (active() && request === listRequest) list.textContent = forumError(error);
      }
    }

    async function loadMessages(soft = false) {
      const request = ++threadRequest;
      const id = partner.id;
      const output = thread.querySelector('.inbox-messages');
      if (!soft) output.textContent = 'Nachrichten werden geladen …';
      try {
        const {data,error} = await cloudClient.from('forum_messages')
          .select('id,author_id,recipient_id,body,created_at,read_at')
          .or(`author_id.eq.${id},recipient_id.eq.${id}`)
          .order('created_at',{ascending:false}).order('id',{ascending:false})
          .range(messagePage * inboxPageSize,(messagePage + 1) * inboxPageSize);
        if (error) throw error;
        if (!active() || request !== threadRequest) return;
        const rows = (data || []).slice(0,inboxPageSize);
        output.innerHTML = `${messagePage || data?.length > inboxPageSize ? `<div class="flex inbox-message-pager">
          ${data?.length > inboxPageSize ? '<button type="button" class="btn" data-inbox-action="next-messages">Ältere Nachrichten</button>' : ''}
          ${messagePage ? '<button type="button" class="btn" data-inbox-action="previous-messages">Neuere Nachrichten</button>' : ''}
        </div>` : ''}
        ${rows.reverse().map(row => `<article class="inbox-message${row.author_id === user ? ' inbox-sent' : ''}">
          <div><strong>${row.author_id === user ? 'Du' : esc(partner.nickname)}</strong>${forumTime(row.created_at)}</div>
          <p class="forum-text">${esc(row.body)}</p>
        </article>`).join('') || '<p class="forum-empty">Schreib die erste Nachricht in dieser Unterhaltung.</p>'}`;
        const unread = rows.filter(row => row.recipient_id === user && !row.read_at).map(row => row.id);
        if (unread.length && !document.hidden && thread.getBoundingClientRect().top < innerHeight) {
          const receipt = await cloudClient.from('forum_messages').update({read_at:new Date().toISOString()})
            .eq('recipient_id',user).in('id',unread).is('read_at',null);
          if (receipt.error) throw receipt.error;
          if (active() && request === threadRequest) {
            loadConversations();
            window.refreshForumIndicators(true);
          }
        }
      } catch (error) {
        if (active() && request === threadRequest) status.textContent = forumError(error);
      }
    }

    async function openConversation(id) {
      if (!isUuid(id) || id === user) return;
      const request = ++threadRequest;
      partner = null;
      messagePage = 0;
      status.textContent = '';
      thread.textContent = 'Unterhaltung wird geladen …';
      try {
        const {data,error} = await cloudClient.from('forum_members').select('user_id,nickname').eq('user_id',id).maybeSingle();
        if (error) throw error;
        if (!active() || request !== threadRequest) return;
        if (!data) {
          thread.innerHTML = '<p class="forum-empty">Dieses Mitglied ist nicht mehr erreichbar.</p>';
          return;
        }
        partner = {id:data.user_id,nickname:data.nickname};
        thread.innerHTML = `<div class="inbox-thread-header">
          <h3 tabindex="-1">${esc(partner.nickname)}</h3>
          <button type="button" class="btn" data-inbox-action="refresh-messages">Nachrichten aktualisieren</button>
        </div>
        <div class="inbox-messages"></div>
        <form class="inbox-compose">
          <label for="inboxMessage">Deine Nachricht</label>
          <textarea id="inboxMessage" name="body" data-voice-reply="inbox-${esc(partner.id)}" required maxlength="2000" rows="3"></textarea>
          <button type="submit" class="btn primary">Nachricht senden</button>
        </form>`;
        const title = thread.querySelector('h3');
        title.focus({preventScroll:true});
        title.scrollIntoView({block:'center',behavior:'instant'});
        loadConversations();
        await loadMessages();
      } catch (error) {
        if (active() && request === threadRequest) thread.textContent = forumError(error);
      }
    }

    async function findMember(name) {
      const request = ++searchRequest;
      results.textContent = '';
      if (name.length < 2 || !/^[\p{L}\p{N} ._\-]+$/u.test(name)) {
        results.textContent = 'Gib mindestens zwei Zeichen des Nicknames ein.';
        return;
      }
      try {
        const prefix = name.replaceAll('_','\\_');
        const {data,error} = await cloudClient.from('forum_members').select('user_id,nickname')
          .ilike('nickname',prefix + '%').neq('user_id',user).order('nickname').limit(10);
        if (error) throw error;
        if (!active() || request !== searchRequest) return;
        results.innerHTML = data?.length ? data.map(row => `<button class="inbox-contact" type="button"
          data-inbox-action="open" data-recipient="${esc(row.user_id)}">An ${esc(row.nickname)} schreiben</button>`).join('')
          : '<p class="forum-empty">Kein passender Nickname gefunden.</p>';
      } catch (error) {
        if (active() && request === searchRequest) results.textContent = forumError(error);
      }
    }

    root.addEventListener('click',event => {
      const button = event.target.closest('[data-inbox-action]');
      if (!button || !active()) return;
      const action = button.dataset.inboxAction;
      if (action === 'profile') go('konto');
      if (action === 'open') openConversation(button.dataset.recipient);
      if (action === 'next-list' || action === 'previous-list') {
        conversationPage += action === 'next-list' ? 1 : -1;
        loadConversations();
      }
      if (action === 'refresh-messages') loadMessages();
      if (action === 'next-messages' || action === 'previous-messages') {
        messagePage += action === 'next-messages' ? 1 : -1;
        loadMessages();
      }
    });
    root.addEventListener('submit',async event => {
      event.preventDefault();
      const form = event.target;
      if (!active()) return;
      if (form.matches('.inbox-search')) {
        await findMember(form.elements.nickname.value.trim());
        return;
      }
      if (!partner || !form.matches('.inbox-compose')) return;
      const body = form.elements.body.value.trim();
      if (!body) { status.textContent = 'Schreib zuerst eine Nachricht.'; return; }
      const button = form.querySelector('button');
      button.disabled = true;
      status.textContent = '';
      try {
        const {error} = await cloudClient.from('forum_messages').insert({recipient_id:partner.id,body});
        if (error) throw error;
        if (!active() || !form.isConnected) return;
        form.reset();
        messagePage = 0;
        conversationPage = 0;
        await Promise.all([loadMessages(true),loadConversations()]);
      } catch (error) {
        if (active() && form.isConnected) status.textContent = error?.code === '23503'
          ? 'Zum Schreiben brauchen beide einen gespeicherten Nickname im Profil.' : forumError(error);
      } finally {
        if (form.isConnected) button.disabled = false;
      }
    });

    root.addEventListener('forum-mail-change',() => {
      if (!active()) return;
      loadConversations();
      if (partner && messagePage === 0) loadMessages(true);
    });
    loadConversations();
    if (target) openConversation(target);
    forumProfile(user).then(({data,error}) => {
      if (!active() || error || data?.nickname) return;
      status.innerHTML = 'Mit einem Nickname kannst du private Nachrichten senden und empfangen. '
        + '<button type="button" class="btn" data-inbox-action="profile">Nickname im Profil eintragen</button>';
    }).catch(() => {});
  };
})();
