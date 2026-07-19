import {
  availableEntries,
  dedupeEntries,
  makeIssueUrl,
  parseEntry,
  secureRandomIndex
} from "./core.mjs";

const translations = {
  en: {
    skip: "Skip to main content",
    booth: "LIVE AT JAMES CAFE · AI DEV DAY",
    heroLine1: "YOUR NAME.",
    heroLine2: "ONE CAPSULE.",
    heroLine3: "VERY GOOD COFFEE.",
    heroLede: "James roasted the beans. The machine picks the winner. Add your name for a chance to take a bag home.",
    nameLabel: "Your name",
    namePlaceholder: "Ada Lovelace",
    nameHelp: "Opens GitHub to record one public entry. No email or phone number needed.",
    enterButton: "GET A CAPSULE",
    nameTooShort: "Enter at least 2 characters so we know what to call you.",
    finishTitle: "Finish on GitHub",
    finishBody: "Create the prefilled issue, then come back and refresh the machine.",
    refreshButton: "I’M IN — REFRESH",
    machineLabel: "Capsule machine showing giveaway entries",
    capsules: "CAPSULES",
    priceLabel: "TODAY",
    priceValue: "FREE",
    hostButton: "HOST DRAW",
    prizeExit: "PRIZE EXIT",
    statusTitle: "MACHINE STATUS",
    statusLoading: "Connecting to the GitHub entry ledger…",
    statusReady: "{count} valid {entryWord} loaded. The machine is ready.",
    statusEmpty: "No entries yet. Be the first name in the machine.",
    statusError: "The GitHub ledger couldn’t load. Check your connection, then refresh.",
    entrySingular: "entry",
    entryPlural: "entries",
    refreshAria: "Refresh entries",
    howIntro: "THREE TURNS OF THE KNOB",
    howTitle: "HOW THE\nMACHINE WORKS",
    step1Title: "NAME IT",
    step1Body: "Type your name above. We’ll prepare a public GitHub Issue—our transparent entry ticket.",
    step2Title: "CAPSULE IT",
    step2Body: "Create the issue on GitHub. Your name appears in the machine when the entries refresh.",
    step3Title: "DRAW IT",
    step3Body: "At giveaway time, the host turns the digital knob and the machine chooses a name at random.",
    roastIntro: "NOT JUST CONFERENCE COFFEE",
    roastTitle: "ROASTED BY JAMES.\nGIVEN AWAY WITH JOY.",
    roastBody: "These aren’t promo bags with a logo slapped on. James roasted this coffee himself for the people building what’s next with AI.",
    whereLabel: "WHERE",
    whereValue: "James Cafe booth",
    whenLabel: "WHEN",
    whenValue: "AI Dev Day · July 19",
    prizeLabel: "PRIZE",
    prizeValue: "Fresh-roasted coffee",
    footerTagline: "CODE. COFFEE. CAPSULES.",
    footerBuilt: "Built for AI Dev Day with GitHub Pages + GitHub Issues.",
    viewSource: "View the source",
    closeHost: "Close host controls",
    hostConsole: "JAMES CAFE · HOST CONSOLE",
    hostTitle: "TURN THE KNOB",
    hostDescription: "A winner is chosen locally from the GitHub entries loaded in this browser. Previous winners are skipped until you reset the draw.",
    readyLabel: "READY TO DRAW",
    readyMeta: "Load entries, then make some coffee magic.",
    noEntriesMeta: "No valid entries are loaded yet.",
    exhaustedMeta: "Every loaded entry has won. Reset the history to draw again.",
    drawingLabel: "CAPSULES ARE MIXING",
    drawingMeta: "Randomizing the loaded entries…",
    winnerLabel: "WE HAVE A WINNER",
    winnerMeta: "Fresh coffee has found a new home.",
    drawButton: "DRAW A WINNER",
    copyWinner: "COPY WINNER",
    copiedWinner: "Winner copied",
    historyTitle: "WINNER HISTORY",
    resetDraw: "RESET",
    historyEmpty: "No winners drawn on this device yet.",
    hostNote: "Host controls are intentionally local: drawing here never edits, closes, or labels a GitHub Issue.",
    resetDone: "Winner history reset",
    entriesRefreshed: "Capsules refreshed"
  },
  ja: {
    skip: "メインコンテンツへ移動",
    booth: "AI DEV DAY · JAMES CAFE より生中継",
    heroLine1: "あなたの名前。",
    heroLine2: "ひとつのカプセル。",
    heroLine3: "最高のコーヒー。",
    heroLede: "豆を焙煎したのはジェームズ。当選者を選ぶのはマシン。名前を入れて、コーヒーバッグを当てよう。",
    nameLabel: "お名前",
    namePlaceholder: "山田 太郎",
    nameHelp: "GitHubで公開エントリーを1件作成します。メールアドレスや電話番号は不要です。",
    enterButton: "カプセルをゲット",
    nameTooShort: "お呼びできるよう、2文字以上でお名前を入力してください。",
    finishTitle: "GitHubでエントリー完了",
    finishBody: "入力済みのIssueを作成したら、このページに戻ってマシンを更新してください。",
    refreshButton: "エントリー済み — 更新",
    machineLabel: "プレゼント応募者のカプセルが入ったマシン",
    capsules: "カプセル",
    priceLabel: "本日",
    priceValue: "無料",
    hostButton: "抽選する",
    prizeExit: "取り出し口",
    statusTitle: "マシンの状態",
    statusLoading: "GitHubのエントリー台帳に接続しています…",
    statusReady: "{count}件のエントリーを読み込みました。抽選できます。",
    statusEmpty: "まだエントリーはありません。最初のカプセルを入れよう。",
    statusError: "GitHubの台帳を読み込めませんでした。接続を確認して更新してください。",
    entrySingular: "entry",
    entryPlural: "entries",
    refreshAria: "エントリーを更新",
    howIntro: "ノブを回す3つのステップ",
    howTitle: "このマシンの\n遊び方",
    step1Title: "名前を入れる",
    step1Body: "上にお名前を入力すると、公開のGitHub Issue（透明性のある応募券）を用意します。",
    step2Title: "カプセルにする",
    step2Body: "GitHubでIssueを作成します。更新すると、あなたの名前がマシンの中に現れます。",
    step3Title: "抽選する",
    step3Body: "プレゼントの時間にホストがデジタルノブを回し、マシンがランダムにお名前を選びます。",
    roastIntro: "ただのイベントコーヒーじゃない",
    roastTitle: "ジェームズが焙煎。\n笑顔でプレゼント。",
    roastBody: "ロゴを貼っただけのノベルティではありません。AIで次の未来を作る皆さんのために、ジェームズ自身が焙煎しました。",
    whereLabel: "場所",
    whereValue: "James Cafe ブース",
    whenLabel: "日時",
    whenValue: "AI Dev Day · 7月19日",
    prizeLabel: "賞品",
    prizeValue: "焙煎したてのコーヒー",
    footerTagline: "コード。コーヒー。カプセル。",
    footerBuilt: "GitHub Pages + GitHub IssuesでAI Dev Dayのために制作。",
    viewSource: "ソースを見る",
    closeHost: "ホスト画面を閉じる",
    hostConsole: "JAMES CAFE · ホスト画面",
    hostTitle: "ノブを回そう",
    hostDescription: "このブラウザに読み込んだGitHubエントリーからローカルで当選者を選びます。リセットするまで当選済みの方は除外されます。",
    readyLabel: "抽選準備OK",
    readyMeta: "エントリーを読み込んで、コーヒーマジックを始めよう。",
    noEntriesMeta: "有効なエントリーがまだ読み込まれていません。",
    exhaustedMeta: "全員が当選しました。履歴をリセットすると再抽選できます。",
    drawingLabel: "カプセルを混ぜています",
    drawingMeta: "読み込んだエントリーをランダムに選択中…",
    winnerLabel: "当選者が決まりました",
    winnerMeta: "焙煎したてのコーヒーをお楽しみください。",
    drawButton: "当選者を選ぶ",
    copyWinner: "名前をコピー",
    copiedWinner: "当選者名をコピーしました",
    historyTitle: "当選履歴",
    resetDraw: "リセット",
    historyEmpty: "この端末ではまだ抽選していません。",
    hostNote: "ホスト操作はローカルのみです。GitHub Issueの編集、クローズ、ラベル付けは行いません。",
    resetDone: "当選履歴をリセットしました",
    entriesRefreshed: "カプセルを更新しました"
  }
};

const repo = document.querySelector('meta[name="github-repo"]').content;
const elements = {
  form: document.querySelector("#entry-form"),
  name: document.querySelector("#entrant-name"),
  nameError: document.querySelector("#name-error"),
  entryConfirm: document.querySelector("#entry-confirm"),
  refreshEntries: document.querySelector("#refresh-entries"),
  statusRefresh: document.querySelector("#status-refresh"),
  status: document.querySelector("#machine-status"),
  statusLight: document.querySelector("#status-light"),
  count: document.querySelector("#entry-count"),
  chamber: document.querySelector("#capsule-chamber"),
  machine: document.querySelector("#machine"),
  hostTrigger: document.querySelector("#host-trigger"),
  hostDialog: document.querySelector("#host-dialog"),
  drawDisplay: document.querySelector("#draw-display"),
  drawButton: document.querySelector("#draw-button"),
  winnerName: document.querySelector("#winner-name"),
  drawMeta: document.querySelector("#draw-meta"),
  copyWinner: document.querySelector("#copy-winner"),
  resetDraw: document.querySelector("#reset-draw"),
  historyList: document.querySelector("#winner-history-list"),
  winnerCapsule: document.querySelector("#winner-capsule"),
  toast: document.querySelector("#toast")
};

const state = {
  entries: [],
  language: localStorage.getItem("james-cafe-language") || (navigator.language.startsWith("ja") ? "ja" : "en"),
  winnerHistory: readHistory(),
  currentWinner: null,
  loading: false
};

function t(key, values = {}) {
  let value = translations[state.language][key] ?? translations.en[key] ?? key;
  for (const [name, replacement] of Object.entries(values)) {
    value = value.replace(`{${name}}`, replacement);
  }
  return value;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.title = state.language === "ja" ? "James Cafe コーヒーガチャ" : "James Cafe Coffee Gacha";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
  });

  if (!state.loading) updateMachineStatus();
  renderHistory();
  updateDrawAvailability();
}

function readHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem("james-cafe-winners") || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && Number.isFinite(item.id) && item.name) : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem("james-cafe-winners", JSON.stringify(state.winnerHistory));
}

async function fetchEntries() {
  if (state.loading) return;
  state.loading = true;
  elements.statusRefresh.classList.add("loading");
  elements.statusLight.className = "status-light";
  elements.status.textContent = t("statusLoading");

  try {
    const issues = [];
    for (let page = 1; page <= 5; page += 1) {
      const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const batch = await response.json();
      issues.push(...batch);
      if (batch.length < 100) break;
    }

    state.entries = dedupeEntries(issues.map(parseEntry).filter(Boolean));
    renderCapsules();
    elements.statusLight.className = "status-light ready";
  } catch (error) {
    console.error(error);
    state.entries = [];
    renderCapsules();
    elements.statusLight.className = "status-light error";
    elements.status.textContent = t("statusError");
  } finally {
    state.loading = false;
    elements.statusRefresh.classList.remove("loading");
    if (!elements.statusLight.classList.contains("error")) updateMachineStatus();
    updateDrawAvailability();
  }
}

function updateMachineStatus() {
  const count = state.entries.length;
  elements.count.textContent = count.toLocaleString(state.language);
  if (count === 0) {
    elements.status.textContent = t("statusEmpty");
    return;
  }
  elements.status.textContent = t("statusReady", {
    count: count.toLocaleString(state.language),
    entryWord: count === 1 ? t("entrySingular") : t("entryPlural")
  });
}

function renderCapsules() {
  elements.chamber.replaceChildren();
  const visible = state.entries.slice(-12);
  const source = visible.length ? visible : [
    { name: "J" },
    { name: "C" },
    { name: "★" },
    { name: "AI" },
    { name: "☕" }
  ];

  source.forEach((entry, index) => {
    const capsule = document.createElement("div");
    capsule.className = `capsule${visible.length ? "" : " capsule-placeholder"}`;
    capsule.style.animationDelay = `${Math.min(index * 45, 360)}ms`;
    capsule.style.zIndex = String(index + 1);
    const label = document.createElement("span");
    label.textContent = entry.name;
    capsule.append(label);
    elements.chamber.append(capsule);
  });
}

function updateDrawAvailability() {
  const available = availableEntries(state.entries, state.winnerHistory);
  elements.drawButton.disabled = available.length === 0;

  if (state.currentWinner) return;
  if (state.entries.length === 0) {
    elements.drawMeta.textContent = t("noEntriesMeta");
  } else if (available.length === 0) {
    elements.drawMeta.textContent = t("exhaustedMeta");
  } else {
    elements.drawMeta.textContent = t("readyMeta");
  }
}

function renderHistory() {
  elements.historyList.replaceChildren();
  if (state.winnerHistory.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-history";
    empty.textContent = t("historyEmpty");
    elements.historyList.append(empty);
    return;
  }

  state.winnerHistory.forEach((winner) => {
    const item = document.createElement("li");
    item.textContent = winner.name;
    elements.historyList.append(item);
  });
}

async function drawWinner() {
  const available = availableEntries(state.entries, state.winnerHistory);
  if (!available.length) return;

  elements.drawButton.disabled = true;
  elements.copyWinner.disabled = true;
  elements.drawDisplay.classList.remove("winner");
  elements.drawDisplay.classList.add("drawing");
  elements.machine.classList.add("drawing");
  elements.winnerName.textContent = "••••••";
  elements.drawDisplay.querySelector("p").textContent = t("drawingLabel");
  elements.drawMeta.textContent = t("drawingMeta");

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  await wait(reducedMotion ? 50 : 1600);

  const winner = available[secureRandomIndex(available.length)];
  state.currentWinner = winner;
  state.winnerHistory.unshift(winner);
  saveHistory();

  elements.drawDisplay.classList.remove("drawing");
  elements.drawDisplay.classList.add("winner");
  elements.machine.classList.remove("drawing");
  elements.winnerName.textContent = winner.name;
  elements.drawDisplay.querySelector("p").textContent = t("winnerLabel");
  elements.drawMeta.textContent = t("winnerMeta");
  elements.copyWinner.disabled = false;
  elements.winnerCapsule.classList.remove("dropping");
  void elements.winnerCapsule.offsetWidth;
  elements.winnerCapsule.classList.add("dropping");
  renderHistory();
  updateDrawAvailability();
}

function resetDraw() {
  state.winnerHistory = [];
  state.currentWinner = null;
  saveHistory();
  elements.winnerName.textContent = "—";
  elements.drawDisplay.querySelector("p").textContent = t("readyLabel");
  elements.drawDisplay.classList.remove("winner", "drawing");
  elements.copyWinner.disabled = true;
  renderHistory();
  updateDrawAvailability();
  showToast(t("resetDone"));
}

async function copyWinner() {
  if (!state.currentWinner) return;
  try {
    await navigator.clipboard.writeText(state.currentWinner.name);
    showToast(t("copiedWinner"));
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(elements.winnerName);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.hidden = true;
  }, 2800);
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elements.name.value.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("nameTooShort");
    elements.name.focus();
    return;
  }

  elements.name.removeAttribute("aria-invalid");
  elements.nameError.textContent = "";
  elements.entryConfirm.hidden = false;
  sessionStorage.setItem("james-cafe-pending-entry", name);
  window.open(makeIssueUrl(repo, name), "_blank", "noopener,noreferrer");
});

elements.name.addEventListener("blur", () => {
  if (elements.name.value && elements.name.value.trim().length < 2) {
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("nameTooShort");
  }
});

elements.name.addEventListener("input", () => {
  if (elements.name.value.trim().length >= 2) {
    elements.name.removeAttribute("aria-invalid");
    elements.nameError.textContent = "";
  }
});

elements.refreshEntries.addEventListener("click", async () => {
  await fetchEntries();
  showToast(t("entriesRefreshed"));
});
elements.statusRefresh.addEventListener("click", fetchEntries);
elements.hostTrigger.addEventListener("click", () => elements.hostDialog.showModal());
elements.drawButton.addEventListener("click", drawWinner);
elements.copyWinner.addEventListener("click", copyWinner);
elements.resetDraw.addEventListener("click", resetDraw);

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    localStorage.setItem("james-cafe-language", state.language);
    applyLanguage();
  });
});

window.addEventListener("focus", () => {
  if (sessionStorage.getItem("james-cafe-pending-entry")) {
    fetchEntries();
  }
});

applyLanguage();
renderCapsules();
fetchEntries();
