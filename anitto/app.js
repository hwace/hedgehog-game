const SUPABASE_URL = "https://mejhusmhvsazvjbfrkwu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_j08dj2xDnQeoElW93mlkGA_TJJJG_UY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const MISSION_PHOTO_BUCKET = "mission-photos";

const state = {
  session: null,
  profile: null,
  settings: {},
  route: "home",
  isLoadingProfile: true,

  rankingCache: null,
  nextRankingRefresh: 0,
};

const view = document.querySelector("#view");
const nav = document.querySelector("#nav");
const toastEl = document.querySelector("#toast");
const logoutBtn = document.querySelector("#logoutBtn");
const chipName = document.querySelector("#chipName");

const routes = [
  ["home", "홈"],
  ["missions", "미션"],
  ["letters", "쪽지"],
  ["guess", "추리"],
  ["ranking", "랭킹"],
  ["admin", "관리자"],
];

init();

async function init() {
  const { data } = await supabase.auth.getSession();
  state.session = data.session;
  await loadProfile();
  bindShell();
  render();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await loadProfile();
    render();
  });
}

function bindShell() {
  document.body.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    if (!routeButton) return;
    state.route = routeButton.dataset.route;
    render();
  });

  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    state.profile = null;
    state.settings = {};
    state.route = "home";
    showToast("로그아웃했습니다.");
    render();
  });
}

async function loadProfile() {
  state.isLoadingProfile = true;
  if (!state.session?.user) {
    state.profile = null;
    state.settings = {};
    state.isLoadingProfile = false;
    return;
  }

  try {
    const [{ data: profile, error: profileError }, { data: settings, error: settingsError }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", state.session.user.id).maybeSingle(),
      supabase.from("settings").select("*"),
    ]);

    if (profileError) throw profileError;
    if (settingsError) throw settingsError;

    state.profile = profile;
    state.settings = Object.fromEntries((settings ?? []).map((row) => [row.key, row.value]));
  } catch (error) {
    console.error("profile load failed", error);
    showToast("사용자 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  } finally {
    state.isLoadingProfile = false;
  }
}

function render() {
  chipName.textContent = state.profile ? state.profile.real_name : "게스트";
  logoutBtn.hidden = !state.session;
  renderNav();

  if (!state.session) {
    view.innerHTML = authTemplate();
    bindAuth();
    return;
  }

  if (state.isLoadingProfile || !state.profile) {
    view.innerHTML = loadingTemplate();
    return;
  }

  if (state.route === "admin" && !state.profile.is_admin) state.route = "home";

  const renderers = {
    home: renderHome,
    missions: renderMissions,
    letters: renderLetters,
    megaphones: renderMegaphones,
    guess: renderGuess,
    ranking: renderRanking,
    admin: renderAdmin,
  };

  renderers[state.route]?.();
}

function renderNav() {
  if (!state.session || !state.profile || state.isLoadingProfile) {
    nav.innerHTML = "";
    return;
  }

  nav.innerHTML = routes
    .filter(([id]) => id !== "admin" || state.profile.is_admin)
    .map(([id, label]) => `<button class="${state.route === id ? "active" : ""}" data-route="${id}" type="button" ${state.route === id ? 'aria-current="page"' : ""}>${label}</button>`)
    .join("");
}

function authTemplate() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Game + Mission + Secret Notes</p>
        <h1>Anitto</h1>
        <p class="muted">마니또를 추리하고, 미션을 인증하고, 익명으로 마음을 전하는 웹사이트입니다.</p>
      </div>
      <section class="auth-panel">
        <div class="auth-title">
          <h2>로그인 / 회원가입</h2>
          <p class="muted">이름, 닉네임, 비밀번호를 입력한 뒤 원하는 버튼을 선택하세요.</p>
        </div>
        <form class="form" id="authForm">
          <div class="field"><label>이름</label><input name="realName" required autocomplete="name" /></div>
          <div class="field"><label>닉네임</label><input name="nickname" required autocomplete="username" /></div>
          <div class="field"><label>비밀번호</label><input name="password" type="password" minlength="6" required autocomplete="current-password" /></div>
          <div class="split-actions">
          <button class="primary" data-auth-action="login" type="submit">로그인하기</button>
            <button class="ghost" data-auth-action="signup" type="submit">처음이면 회원가입</button>
          </div>
        </form>
      </section>
    </section>
  `;
}

function loadingTemplate() {
  return `
    <section class="card loading-card">
      <h2>불러오는 중</h2>
      <p class="muted">계정 정보를 확인하고 있습니다.</p>
    </section>
  `;
}

function bindAuth() {
  document.querySelector("#authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const action = event.submitter?.dataset.authAction;
    const form = getFormValues(event.currentTarget);
    const email = nicknameToEmail(form.nickname);
    const password = form.password;
    const realName = form.realName.trim();
    const nickname = form.nickname.trim();

    if (action === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return showToast(error.message);

      await loadProfile();
      if (state.profile?.real_name !== realName || state.profile?.nickname !== nickname) {
        await supabase.auth.signOut();
        return showToast("이름, 닉네임, 비밀번호가 모두 일치해야 로그인할 수 있습니다.");
      }
      showToast("로그인했습니다.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          real_name: realName,
          nickname: nickname,
        },
      },
    });

    if (error) {
      console.error("signup failed", error);
      return showToast(readableAuthError(error));
    }
    if (data.user?.identities?.length === 0) {
      return showToast("이미 가입된 닉네임입니다. 로그인해 주세요.");
    }
    showToast("회원가입 완료! 이제 로그인해 주세요.");
  });
}

async function renderHome() {
  const [{ data: manitto }, { data: notifications }, { count: lettersCount }] = await Promise.all([
    supabase.from("manittos").select("receiver:receiver_id(real_name,nickname)").eq("giver_id", state.profile.id).maybeSingle(),
    supabase.from("notifications").select("*").eq("user_id", state.profile.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("letters").select("*", { count: "exact", head: true }).eq("receiver_id", state.profile.id),
  ]);

  const canJoinParty = !state.profile.is_admin && !state.profile.joined_party && state.settings.game_started !== "true" && state.settings.signup_closed !== "true";

  view.innerHTML = `
    <section class="grid">
      ${metricCard("내 점수", state.profile.score, "랭킹에 사용됩니다.")}
      ${metricCard("내 코인", state.profile.coins, "쪽지, 추리, 확성기에 사용할 수 있습니다.")}
      ${metricCard("받은 쪽지", lettersCount ?? 0, "마니또가 남긴 흔적일지도 몰라요.")}
      <article class="card span-3">
        <div class="card-head"><h3>게임 상태</h3>${statusPill()}</div>
        <p class="muted">${state.settings.game_started === "true" ? "마니또 추리가 열렸습니다." : "관리자가 게임을 시작하면 마니또가 배정됩니다."}</p>
      </article>
      <article class="card span-12">
        <div class="card-head">
          <div>
            <h3>파티 참여</h3>
            <p class="muted">${partyJoinMessage()}</p>
          </div>
          ${state.profile.joined_party ? `<span class="pill green">참여 완료</span>` : `<span class="pill yellow">미참여</span>`}
        </div>
        ${canJoinParty ? `<button class="primary" id="joinPartyBtn" type="button">파티 참여하기</button>` : ""}
      </article>
      <article class="card span-6">
        <div class="card-head"><h3>내 마니또 후보</h3><span class="pill yellow">비공개</span></div>
        <p>${manitto?.receiver ? `${escapeHtml(manitto.receiver.real_name)}님에게 익명으로 마음을 전해보세요.` : "아직 마니또가 배정되지 않았습니다."}</p>
      </article>
      <article class="card span-6">
        <div class="card-head"><h3>최근 알림</h3></div>
        <div class="list">${listOrEmpty(notifications, (n) => `<div class="item"><div><div class="item-title">${escapeHtml(n.message)}</div><div class="item-sub">${formatDate(n.created_at)}</div></div></div>`)}</div>
      </article>
    </section>
  `;

  document.querySelector("#joinPartyBtn")?.addEventListener("click", async () => {
    const ok = await confirmAction("파티 참여", "이번 Anitto 게임에 참여하시겠습니까?");
    if (!ok) return;
    const { error } = await supabase.from("profiles").update({ joined_party: true }).eq("id", state.profile.id);
    if (error) return showToast(error.message);
    await loadProfile();
    showToast("파티 참여가 완료되었습니다.");
    renderHome();
  });
}

async function renderMissions() {
  const [{ data: missions }, { data: completed }, { data: requests }] = await Promise.all([
    supabase.from("missions").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("mission_completions").select("*").eq("user_id", state.profile.id),
    supabase.from("mission_requests").select("*").eq("requester_id", state.profile.id).order("created_at", { ascending: false }).limit(5),
  ]);
  const completedIds = new Set((completed ?? []).map((row) => row.mission_id));
  const hasMissions = Boolean(missions?.length);

  view.innerHTML = `
    <section class="grid">
      <article class="card span-5">
        <h2>미션</h2>
        <p class="muted">완료하면 점수와 코인이 즉시 지급됩니다.</p>
        <form class="form" id="missionProofForm">
          <div class="field"><label>완료할 미션</label><select name="missionId" required ${hasMissions ? "" : "disabled"}>${hasMissions ? missions.map((m) => `<option value="${m.id}">${escapeHtml(m.title)}</option>`).join("") : `<option>열린 미션이 없습니다</option>`}</select></div>
          <div class="field"><label>인증 사진</label><input name="photo" type="file" accept="image/*" /></div>
          <div class="field"><label>설명</label><textarea name="description" placeholder="어떻게 해결했는지, TMI를 설명해주세요."></textarea></div>
          <button class="primary" type="submit" ${hasMissions ? "" : "disabled"}>미션 완료</button>
        </form>
      </article>
      <article class="card span-7">
        <div class="list">
          ${listOrEmpty(missions, (m) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(m.title)}</div>
                <div class="item-sub">${escapeHtml(m.description ?? "")}</div>
              </div>
              <div class="actions">
                <span class="pill">+${m.score_reward}점</span>
                <span class="pill green">+${m.coin_reward}코인</span>
                ${completedIds.has(m.id) ? `<span class="pill yellow">완료</span>` : ""}
              </div>
            </div>`)}
        </div>
      </article>
      <article class="card span-5">
        <h2>미션 추가 요청</h2>
        <p class="muted">해보고 싶은 미션을 관리자에게 제안할 수 있습니다.</p>
        <form class="form" id="missionRequestForm">
          <div class="field"><label>미션 제목</label><input name="title" required /></div>
          <div class="field"><label>설명</label><textarea name="description" placeholder="어떤 방식으로 인증하면 좋을지 적어주세요."></textarea></div>
          <button class="primary" type="submit">요청 보내기</button>
        </form>
      </article>
      <article class="card span-7">
        <div class="card-head"><h3>내 요청 현황</h3></div>
        <div class="list">
          ${listOrEmpty(requests, (request) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(request.title)}</div>
                <div class="item-sub">${escapeHtml(request.description ?? "")} · ${formatDate(request.created_at)}</div>
              </div>
              ${statusBadge(request.status)}
            </div>`)}
        </div>
      </article>
    </section>
  `;

  document.querySelector("#missionProofForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = getFormValues(event.currentTarget);
    const ok = await confirmAction("미션 완료", "정말 완료하셨습니까?");
    if (!ok) return;
    const mission = (missions ?? []).find((row) => row.id === form.missionId);
    if (!mission) return showToast("미션을 찾을 수 없습니다.");
    let photoUrl = null;

    const { error } = await supabase.from("mission_completions").insert({
      user_id: state.profile.id,
      mission_id: form.missionId,
      photo_url: photoUrl || null,
      description: form.description || null,
    });
    if (error) return showToast(error.message);

    const { error: rewardError } = await supabase.from("profiles").update({
      score: state.profile.score + mission.score_reward,
      coins: state.profile.coins + mission.coin_reward,
    }).eq("id", state.profile.id);
    if (rewardError) return showToast(rewardError.message);
    await loadProfile();
    showToast("미션 완료! 보상이 지급되었습니다.");
    renderMissions();
  });

  document.querySelector("#missionRequestForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = getFormValues(event.currentTarget);
    const { error } = await supabase.from("mission_requests").insert({
      requester_id: state.profile.id,
      title: form.title,
      description: form.description || null,
    });
    if (error) return showToast(error.message);
    showToast("미션 요청을 보냈습니다.");
    renderMissions();
  });
}

async function renderLetters() {
  const [{ data: manitto }, { data: received }] = await Promise.all([
    supabase.from("manittos").select("receiver_id, receiver:receiver_id(real_name,nickname)").eq("giver_id", state.profile.id).maybeSingle(),
    supabase.from("letters").select("*, sender:sender_id(nickname)").eq("receiver_id", state.profile.id).order("created_at", { ascending: false }),
  ]);

  view.innerHTML = `
    <section class="grid">
      <article class="card span-5">
        <h2>익명 쪽지</h2>
        <p class="muted">내 마니또에게만 보낼 수 있습니다. 비용은 20코인입니다.</p>
        ${coinBalanceLine()}
        <form class="form" id="letterForm">
          <div class="field"><label>받는 사람</label><input value="${escapeAttr(manitto?.receiver?.real_name ?? "마니또 미배정")}" disabled /></div>
          <div class="field"><label>내용</label><textarea name="content" maxlength="200" required></textarea></div>
          <button class="primary" ${!manitto || state.profile.coins < 20 ? "disabled" : ""} type="submit">${state.profile.coins < 20 ? "코인이 부족합니다" : "20코인으로 보내기"}</button>
        </form>
      </article>
      <article class="card span-7">
        <div class="card-head"><h3>받은 쪽지</h3></div>
        <div class="list">
          ${listOrEmpty(received, (letter) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(letter.content)}</div>
                <div class="item-sub"> - ${escapeHtml(letter.sender?.nickname ?? "알 수 없음")} 보냄 -</div>
              </div>
            </div>`)}
        </div>
      </article>
    </section>
  `;

  document.querySelector("#letterForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!manitto?.receiver_id) return showToast("아직 마니또가 배정되지 않았습니다.");
    if (state.profile.coins < 20) return showToast("코인이 부족합니다.");
    const form = getFormValues(event.currentTarget);
    const { error } = await supabase.from("letters").insert({
      sender_id: state.profile.id,
      receiver_id: manitto.receiver_id,
      content: form.content,
    });
    if (error) return showToast(error.message);
    const spendError = await spendCoins(20);
    if (spendError) return showToast(spendError.message);
    await notify(manitto.receiver_id, "letter", "새 익명 쪽지가 도착했습니다.");
    showToast("쪽지를 보냈습니다.");
    renderLetters();
  });
}

async function renderMegaphones() {
  const [{ data }, { data: manittos }] = await Promise.all([
    supabase.from("megaphones").select("*, author:author_id(real_name,nickname)").order("created_at", { ascending: false }),
    supabase.from("manittos").select("giver_id, receiver:receiver_id(real_name)"),
  ]);
  const manittoLabels = Object.fromEntries((manittos ?? []).map((row) => [row.giver_id, `${row.receiver?.real_name ?? "누군가"}의 마니또`]));

  view.innerHTML = `
    <section class="grid">
      <article class="card span-4">
        <h2>확성기</h2>
        <p class="muted">전체 참가자에게 공개됩니다. 비용은 50코인입니다.</p>
        ${coinBalanceLine()}
        <form class="form" id="megaphoneForm">
          <div class="field"><label>내용</label><textarea name="content" required></textarea></div>
          <div class="field">
            <label>표시 이름</label>
            <select name="displayType">
              <option value="real_name">실명으로 표시</option>
              <option value="nickname">닉네임으로 표시</option>
              <option value="manitto">내가 맡은 사람의 마니또로 표시</option>
            </select>
          </div>
          <button class="primary" type="submit" ${state.profile.coins < 50 ? "disabled" : ""}>${state.profile.coins < 50 ? "코인이 부족합니다" : "50코인으로 게시"}</button>
        </form>
      </article>
      <article class="card span-8">
        <div class="list">
          ${listOrEmpty(data, (m) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(m.content)}</div>
                <div class="item-sub">${escapeHtml(megaphoneAuthorLabel(m, manittoLabels))} · ${formatDate(m.created_at)}</div>
              </div>
              <div class="actions">
                <button class="ghost small" data-mega-like="${m.id}" type="button">좋아요 ${m.likes}</button>
                <button class="ghost small" data-mega-dislike="${m.id}" type="button">싫어요 ${m.dislikes}</button>
              </div>
            </div>`)}
        </div>
      </article>
    </section>
  `;

  document.querySelector("#megaphoneForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.profile.coins < 50) return showToast("코인이 부족합니다.");
    const form = getFormValues(event.currentTarget);
    const { error } = await supabase.from("megaphones").insert({
      author_id: state.profile.id,
      content: form.content,
      is_anonymous: form.displayType !== "real_name",
      display_type: form.displayType || "real_name",
    });
    if (error) return showToast(error.message);
    const spendError = await spendCoins(50);
    if (spendError) return showToast(spendError.message);
    showToast("확성기를 게시했습니다.");
    renderMegaphones();
  });

  document.querySelectorAll("[data-mega-like], [data-mega-dislike]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.megaLike ?? button.dataset.megaDislike;
      const reactionType = button.dataset.megaLike ? "like" : "dislike";
      const { error } = await supabase.from("megaphone_reactions").upsert({
        megaphone_id: id,
        user_id: state.profile.id,
        reaction_type: reactionType,
      }, { onConflict: "megaphone_id,user_id" });
      if (error) return showToast(error.message);
      const { error: countError } = await updateMegaphoneCounts(id);
      if (countError) return showToast(countError.message);
      showToast("반응을 저장했습니다.");
      renderMegaphones();
    });
  });
}

async function updateMegaphoneCounts(megaphoneId) {
  const [{ count: likes }, { count: dislikes }] = await Promise.all([
    supabase.from("megaphone_reactions").select("*", { count: "exact", head: true }).eq("megaphone_id", megaphoneId).eq("reaction_type", "like"),
    supabase.from("megaphone_reactions").select("*", { count: "exact", head: true }).eq("megaphone_id", megaphoneId).eq("reaction_type", "dislike"),
  ]);
  return supabase.from("megaphones").update({ likes: likes ?? 0, dislikes: dislikes ?? 0 }).eq("id", megaphoneId);
}

async function renderGuess() {
  const [{ data: people }, { data: guesses }] = await Promise.all([
    supabase.from("profiles").select("id,real_name").eq("joined_party", true).eq("is_admin", false).order("real_name"),
    supabase.from("deductions").select("*, target:target_user_id(real_name), guessed:guessed_manitto_id(real_name)").eq("guesser_id", state.profile.id).order("created_at", { ascending: false }),
  ]);

  const solvedTargetIds = new Set((guesses ?? []).filter((guess) => guess.is_correct).map((guess) => guess.target_user_id));
  const targets = (people ?? []).filter((p) => p.id !== state.profile.id && !solvedTargetIds.has(p.id));
  const targetOptions = targets.map((p) => `<option value="${p.id}">${escapeHtml(p.real_name)}</option>`).join("");
  const guessOptions = (people ?? []).map((p) => `<option value="${p.id}">${escapeHtml(p.real_name)}</option>`).join("");
  const canGuess = state.settings.game_started === "true" && state.profile.coins >= 100 && targets.length > 0 && (people?.length ?? 0) > 1;
  view.innerHTML = `
    <section class="grid">
      <article class="card span-5">
        <h2>마니또 추리</h2>
        <p class="muted">비용은 100코인입니다. 맞추면 +100점, 들킨 사람은 -300점입니다. 틀리면 -200점입니다.</p>
        ${coinBalanceLine()}
        <form class="form" id="guessForm">
          <div class="field"><label>@@@(이)가</label><select name="targetUserId" ${canGuess ? "" : "disabled"}>${targetOptions || `<option>추리할 참가자가 없습니다</option>`}</select></div>
          <div class="field"><label>뽑은 마니또는 @@@이다.</label><select name="guessedManittoId" ${canGuess ? "" : "disabled"}>${guessOptions || `<option>후보가 없습니다</option>`}</select></div>
          <button class="primary" type="submit" ${canGuess ? "" : "disabled"}>${state.profile.coins < 100 ? "코인이 부족합니다" : "100코인으로 추리"}</button>
        </form>
      </article>
      <article class="card span-7">
        <div class="list">
          ${listOrEmpty(guesses, (g) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(g.target?.real_name)}의 마니또는 ${escapeHtml(g.guessed?.real_name)}이다</div>
                <div class="item-sub">${formatDate(g.created_at)}</div>
              </div>
              <span class="pill ${g.is_correct ? "green" : "red"}">${g.is_correct ? "성공" : "실패"}</span>
            </div>`)}
        </div>
      </article>
    </section>
  `;

  document.querySelector("#guessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.settings.game_started !== "true") return showToast("게임이 시작된 뒤 추리할 수 있습니다.");
    if (state.profile.coins < 100) return showToast("코인이 부족합니다.");
    const form = getFormValues(event.currentTarget);
    if (!form.targetUserId || !form.guessedManittoId) return showToast("추리할 참가자를 선택해 주세요.");
    if (solvedTargetIds.has(form.targetUserId)) return showToast("이미 맞춘 대상은 다시 추리할 수 없습니다.");
    if (form.targetUserId === form.guessedManittoId) return showToast("자기 자신을 마니또로 추리할 수는 없습니다.");
    const ok = await confirmAction("추리하기", "100코인을 사용해 추리하시겠습니까?");
    if (!ok) return;

    const { data: answer } = await supabase.from("manittos").select("giver_id").eq("receiver_id", form.targetUserId).maybeSingle();
    const isCorrect = answer?.giver_id === form.guessedManittoId;
    const { error } = await supabase.from("deductions").insert({
      guesser_id: state.profile.id,
      target_user_id: form.targetUserId,
      guessed_manitto_id: form.guessedManittoId,
      is_correct: isCorrect,
    });
    if (error) return showToast(error.message);

    const { error: profileError } = await supabase.from("profiles").update({
      coins: state.profile.coins - 100,
      score: state.profile.score + (isCorrect ? 100 : -200),
    }).eq("id", state.profile.id);
    if (profileError) return showToast(profileError.message);

    if (isCorrect) {
      const { data: guessedProfile } = await supabase.from("profiles").select("score").eq("id", form.guessedManittoId).single();
      const { error: penaltyError } = await supabase.from("profiles").update({ score: (guessedProfile?.score ?? 0) - 300 }).eq("id", form.guessedManittoId);
      if (penaltyError) return showToast(`상대 점수 차감 실패: ${penaltyError.message}`);
    }

    await loadProfile();
    showToast(isCorrect ? "추리 성공! +100점" : "추리 실패. -200점");
    renderGuess();
  });
}

async function renderRanking() {
  const now = Date.now();

  if (
    !state.rankingCache ||
    now > state.nextRankingRefresh
  ) {
    const { data } = await supabase
      .from("profiles")
      .select("nickname,score,joined_party")
      .eq("joined_party", true)
      .order("score", { ascending: false });

    state.rankingCache = data ?? [];

    const randomMinutes =
      Math.floor(Math.random() * 120) + 30;

    state.nextRankingRefresh =
      now + randomMinutes * 60 * 1000;
  }

  const data = state.rankingCache;

  view.innerHTML = `
    <section class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>순위</th>
            <th>닉네임</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          ${(data ?? []).map((p, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(p.nickname)}</td>
              <td>${p.score}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p class="muted">
         - 랭킹은 랜덤한 시간마다 갱신됩니다.
      </p>
    </section>
  `;
}

async function renderAdmin() {
  const [{ data: profiles }, { data: missions }, { data: missionRequests }, { count: lettersCount }, { count: megaphonesCount }] = await Promise.all([
    supabase.from("profiles").select("id,nickname,score,coins,joined_party,is_admin,created_at").order("created_at"),
    supabase.from("missions").select("*").order("created_at", { ascending: false }),
    supabase.from("mission_requests").select("*, requester:requester_id(real_name,nickname)").order("created_at", { ascending: false }),
    supabase.from("letters").select("*", { count: "exact", head: true }),
    supabase.from("megaphones").select("*", { count: "exact", head: true }),
  ]);
  const joinedProfiles = (profiles ?? []).filter((profile) => profile.joined_party && !profile.is_admin);

  view.innerHTML = `
    <section class="grid">
      ${metricCard("참가자", joinedProfiles.length, "파티 참여를 완료한 사용자")}
      ${metricCard("총 미션", missions?.length ?? 0, "활성/비활성 포함")}
      ${metricCard("총 쪽지", lettersCount ?? 0, "익명 쪽지")}
      ${metricCard("총 확성기", megaphonesCount ?? 0, "전체 공개 글")}
      <article class="card span-4">
        <h2>게임 관리</h2>
        <div class="actions" style="margin-top:16px">
          <button class="primary" id="startGameBtn" type="button">게임 시작</button>
          <button class="danger" id="endGameBtn" type="button">게임 종료</button>
        </div>
      </article>
      <article class="card span-8">
        <h2>미션 생성</h2>
        <form class="form" id="missionForm">
          <div class="field"><label>제목</label><input name="title" required /></div>
          <div class="field"><label>설명</label><textarea name="description"></textarea></div>
          <div class="grid">
            <div class="field span-6"><label>점수 보상</label><input name="scoreReward" type="number" value="10" /></div>
            <div class="field span-6"><label>코인 보상</label><input name="coinReward" type="number" value="10" /></div>
          </div>
          <button class="primary" type="submit">미션 추가</button>
        </form>
      </article>
      <article class="card span-12">
        <h2>미션 요청</h2>
        <div class="list">
          ${listOrEmpty(missionRequests, (request) => `
            <div class="item">
              <div class="item-main">
                <div class="item-title">${escapeHtml(request.title)}</div>
                <div class="item-sub">${escapeHtml(request.description ?? "")} · 요청자: ${escapeHtml(request.requester?.real_name ?? request.requester?.nickname ?? "알 수 없음")} · ${formatDate(request.created_at)}</div>
              </div>
              <div class="actions">
                ${statusBadge(request.status)}
                ${request.status === "pending" ? `
                  <button class="primary small" data-request-approve="${request.id}" type="button">미션으로 추가</button>
                  <button class="ghost small" data-request-reject="${request.id}" type="button">거절</button>
                ` : ""}
              </div>
            </div>`)}
        </div>
      </article>
      <article class="card span-12">
        <h2>참가자 관리</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>닉네임</th><th>파티</th><th>점수</th><th>코인</th><th>관리자</th></tr></thead>
            <tbody>${(profiles ?? []).map((p) => `<tr><td>${escapeHtml(p.nickname)}</td><td>${p.joined_party ? "참여" : "미참여"}</td><td>${p.score}</td><td>${p.coins}</td><td>${p.is_admin ? "예" : "아니오"}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  document.querySelector("#missionForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = getFormValues(event.currentTarget);
    const { error } = await supabase.from("missions").insert({
      title: form.title,
      description: form.description,
      score_reward: Number(form.scoreReward || 0),
      coin_reward: Number(form.coinReward || 0),
    });
    if (error) return showToast(error.message);
    showToast("미션을 추가했습니다.");
    renderAdmin();
  });

  document.querySelectorAll("[data-request-approve]").forEach((button) => {
    button.addEventListener("click", async () => {
      const request = (missionRequests ?? []).find((row) => row.id === button.dataset.requestApprove);
      if (!request) return showToast("요청을 찾을 수 없습니다.");
      const { error: missionError } = await supabase.from("missions").insert({
        title: request.title,
        description: request.description,
        score_reward: 10,
        coin_reward: 10,
      });
      if (missionError) return showToast(missionError.message);
      const { error } = await supabase.from("mission_requests").update({ status: "approved" }).eq("id", request.id);
      if (error) return showToast(error.message);
      showToast("요청을 미션으로 추가했습니다.");
      renderAdmin();
    });
  });

  document.querySelectorAll("[data-request-reject]").forEach((button) => {
    button.addEventListener("click", async () => {
      const { error } = await supabase.from("mission_requests").update({ status: "rejected" }).eq("id", button.dataset.requestReject);
      if (error) return showToast(error.message);
      showToast("미션 요청을 거절했습니다.");
      renderAdmin();
    });
  });

  document.querySelector("#startGameBtn").addEventListener("click", async () => {
    const ok = await confirmAction("게임 시작", "파티 참여를 마감하고 참여자끼리 무작위 마니또를 배정합니다.");
    if (!ok) return;
    await startGame(joinedProfiles);
  });

  document.querySelector("#endGameBtn").addEventListener("click", async () => {
    const ok = await confirmAction("게임 종료", "게임을 종료합니다.");
    if (!ok) return;
    await setSetting("game_ended", "true");
    await supabase.from("manittos").update({ revealed: true }).neq("id", "00000000-0000-0000-0000-000000000000");
    await loadProfile();
    showToast("게임을 종료했습니다.");
    renderAdmin();
  });
}

async function startGame(profiles) {
  if (state.settings.game_started === "true") return showToast("이미 게임이 시작되었습니다.");
  if (profiles.length < 2) return showToast("참가자가 2명 이상 필요합니다.");
  const shuffled = [...profiles].sort(() => Math.random() - 0.5);
  const pairs = shuffled.map((giver, index) => ({
    giver_id: giver.id,
    receiver_id: shuffled[(index + 1) % shuffled.length].id,
  }));

  const { error } = await supabase.from("manittos").insert(pairs);
  if (error) return showToast(error.message);

  const results = await Promise.all([
    setSetting("signup_closed", "true"),
    setSetting("game_started", "true"),
  ]);
  const settingError = results.find((result) => result.error)?.error;
  if (settingError) return showToast(settingError.message);
  await loadProfile();
  showToast("게임을 시작했습니다. 마니또가 배정되었습니다.");
  renderAdmin();
}

function metricCard(title, value, sub) {
  return `<article class="card span-3"><div class="card-head"><h3>${title}</h3></div><div class="metric">${value}</div><p class="muted">${sub}</p></article>`;
}

function coinBalanceLine() {
  return `<div class="coin-balance"><span>내 보유 코인</span><strong>${state.profile.coins}코인</strong></div>`;
}

function megaphoneAuthorLabel(megaphone, manittoLabels) {
  if (megaphone.display_type === "nickname") return megaphone.author?.nickname ?? "알 수 없음";
  if (megaphone.display_type === "manitto") return manittoLabels[megaphone.author_id] ?? "마니또 미배정";
  if (megaphone.is_anonymous) return "익명";
  return megaphone.author?.real_name ?? "알 수 없음";
}

function statusBadge(status) {
  const labels = {
    pending: ["대기", "yellow"],
    approved: ["승인", "green"],
    rejected: ["거절", "red"],
  };
  const [label, color] = labels[status] ?? [status, ""];
  return `<span class="pill ${color}">${label}</span>`;
}

function statusPill() {
  if (state.settings.game_ended === "true") return `<span class="pill red">종료</span>`;
  if (state.settings.game_started === "true") return `<span class="pill green">진행 중</span>`;
  return `<span class="pill yellow">대기</span>`;
}

function partyJoinMessage() {
  if (state.profile.is_admin) return "관리자 계정은 게임에 참여하지 않습니다.";
  if (state.profile.joined_party) return "이번 Anitto 게임에 참여 중입니다.";
  if (state.settings.game_started === "true" || state.settings.signup_closed === "true") return "게임이 시작되어 더 이상 파티에 참여할 수 없습니다.";
  return "로그인한 계정으로 이번 Anitto 게임에 참여할 수 있습니다.";
}

async function setSetting(key, value) {
  return supabase.from("settings").upsert({ key, value });
}

async function spendCoins(amount) {
  const { error } = await supabase.from("profiles").update({ coins: state.profile.coins - amount }).eq("id", state.profile.id);
  if (error) return error;
  await loadProfile();
  return null;
}

async function notify(userId, type, message) {
  return supabase.from("notifications").insert({ user_id: userId, type, message });
}

function nicknameToEmail(nickname) {
  const clean = nickname.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let hash = 0;
  for (const char of nickname.trim()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `${clean || "user"}-${hash.toString(36)}@anitto.app`;
}

function readableAuthError(error) {
  if (error.message?.toLowerCase().includes("email signups are disabled")) {
    return "Supabase에서 Email 회원가입이 꺼져 있습니다. Auth > Providers > Email에서 회원가입을 켜주세요.";
  }
  if (error.status >= 500) return "회원가입 처리 중 서버 오류가 났습니다. Supabase에서 schema.sql의 PROFILE AUTO CREATE 함수를 다시 실행해 주세요.";
  if (error.message?.toLowerCase().includes("already")) return "이미 가입된 닉네임입니다. 로그인해 주세요.";
  return error.message;
}

function getFormValues(form) {
  return Object.fromEntries(new window.FormData(form).entries());
}

function listOrEmpty(items, renderer) {
  return items?.length ? items.map(renderer).join("") : `<p class="muted">아직 표시할 내용이 없습니다.</p>`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function confirmAction(title, message) {
  const dialog = document.querySelector("#confirmDialog");
  document.querySelector("#dialogTitle").textContent = title;
  document.querySelector("#dialogMessage").textContent = message;
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "confirm"), { once: true });
  });
}
