import {
  availableEntries,
  createDemoEntries,
  createLocalEntry,
  entriesToCsv,
  hasEntryName,
  normalizeName,
  secureRandomIndex
} from "./core.mjs";

const ENTRY_STORAGE_KEY = "james-cafe-entries";
const WINNER_STORAGE_KEY = "james-cafe-winners";
const DEMO_NAMES = [
  "Alex Chen",
  "Priya Shah",
  "Marcus Johnson",
  "Yuki Tanaka",
  "Sofia Martinez",
  "Noah Williams",
  "Amina Okafor",
  "Leo Rossi",
  "Maya Patel",
  "Kenji Sato",
  "Elena Garcia",
  "Owen Murphy",
  "Nora Ibrahim",
  "Theo Martin",
  "Mei Lin",
  "Sam Rivera",
  "Hana Suzuki",
  "Jordan Lee",
  "Amara Davis",
  "Luca Bianchi",
  "Rina Kobayashi",
  "Mateo Silva",
  "Zoe Anderson",
  "Haruto Mori"
];

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
    nameHelp: "Your entry stays safely on this booth device. No account, email, or phone number needed.",
    enterButton: "GET A CAPSULE",
    nameTooShort: "Enter at least 2 characters so we know what to call you.",
    nameDuplicate: "That name already has a capsule. Add a last initial if this is someone else.",
    storageError: "This browser couldn’t save the entry. Ask the booth host to check private-browsing settings.",
    finishTitle: "Capsule accepted!",
    finishBody: "Your name is saved on this device and is now inside the machine.",
    addAnotherButton: "ADD ANOTHER NAME",
    machineLabel: "Capsule machine showing locally saved giveaway entries",
    capsules: "CAPSULES",
    priceLabel: "TODAY",
    priceValue: "FREE",
    hostButton: "HOST DRAW",
    prizeExit: "PRIZE EXIT",
    statusTitle: "MACHINE STATUS",
    statusReady: "{count} saved {entryWord} in the machine. Ready to draw.",
    statusEmpty: "No entries yet. Be the first name in the machine.",
    entrySingular: "entry",
    entryPlural: "entries",
    howIntro: "THREE TURNS OF THE KNOB",
    howTitle: "HOW THE\nMACHINE WORKS",
    step1Title: "NAME IT",
    step1Body: "Type your name at the booth. No sign-in or personal contact details are needed.",
    step2Title: "CAPSULE IT",
    step2Body: "Your entry is saved instantly on this device and drops straight into the machine.",
    step3Title: "DRAW IT",
    step3Body: "At giveaway time, the host turns the digital knob and the machine chooses a saved name at random.",
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
    footerBuilt: "Built for AI Dev Day with GitHub Pages. Entries stay on this booth device.",
    viewSource: "View the source",
    closeHost: "Close host controls",
    hostConsole: "JAMES CAFE · HOST CONSOLE",
    hostTitle: "TURN THE KNOB",
    hostDescription: "A winner is chosen locally from entries saved on this booth device. Previous winners are skipped until you reset the draw.",
    readyLabel: "READY TO DRAW",
    readyMeta: "Add entries, then make some coffee magic.",
    noEntriesMeta: "No saved entries yet.",
    exhaustedMeta: "Every saved entry has won. Reset the history to draw again.",
    drawingLabel: "CAPSULES ARE MIXING",
    drawingMeta: "Randomizing the saved entries…",
    winnerLabel: "WE HAVE A WINNER",
    winnerMeta: "Fresh coffee has found a new home.",
    drawButton: "DRAW A WINNER",
    copyWinner: "COPY WINNER",
    copiedWinner: "Winner copied",
    historyTitle: "WINNER HISTORY",
    resetDraw: "RESET",
    historyEmpty: "No winners drawn on this device yet.",
    entryToolsTitle: "ENTRY BACKUP",
    loadDemo: "LOAD DEMO",
    exitDemo: "EXIT DEMO",
    statusDemo: "DEMO MODE · {count} test entries in memory. Nothing is saved.",
    demoLoaded: "Demo mode loaded with {count} test entries",
    demoExited: "Demo mode closed. Saved entries restored.",
    exportEntries: "EXPORT CSV",
    clearEntries: "CLEAR ENTRIES",
    confirmClear: "CONFIRM CLEAR",
    exportEmpty: "Add at least one entry before exporting.",
    exportDone: "Entry backup downloaded",
    entriesCleared: "All entries and winner history cleared",
    demoEntriesCleared: "Demo entries cleared. Saved entries are untouched.",
    hostNote: "Entries and winner history live only in this browser. Export a CSV backup before clearing browser data or moving devices.",
    resetDone: "Winner history reset",
    entrySaved: "Capsule saved"
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
    nameHelp: "応募はこのブースの端末だけに安全に保存されます。アカウント、メール、電話番号は不要です。",
    enterButton: "カプセルをゲット",
    nameTooShort: "お呼びできるよう、2文字以上でお名前を入力してください。",
    nameDuplicate: "そのお名前のカプセルはすでにあります。別の方なら名字の頭文字などを追加してください。",
    storageError: "このブラウザに応募を保存できませんでした。プライベートブラウズ設定をホストに確認してください。",
    finishTitle: "カプセルを受け付けました！",
    finishBody: "お名前をこの端末に保存し、マシンの中に入れました。",
    addAnotherButton: "別の名前を追加",
    machineLabel: "この端末に保存した応募者のカプセルが入ったマシン",
    capsules: "カプセル",
    priceLabel: "本日",
    priceValue: "無料",
    hostButton: "抽選する",
    prizeExit: "取り出し口",
    statusTitle: "マシンの状態",
    statusReady: "{count}件の応募をこのマシンに保存しました。抽選できます。",
    statusEmpty: "まだ応募はありません。最初のカプセルを入れよう。",
    entrySingular: "entry",
    entryPlural: "entries",
    howIntro: "ノブを回す3つのステップ",
    howTitle: "このマシンの\n遊び方",
    step1Title: "名前を入れる",
    step1Body: "ブースでお名前を入力します。ログインや連絡先の入力は必要ありません。",
    step2Title: "カプセルにする",
    step2Body: "応募はこの端末にすぐ保存され、そのままマシンの中に入ります。",
    step3Title: "抽選する",
    step3Body: "プレゼントの時間にホストがデジタルノブを回し、保存したお名前からランダムに選びます。",
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
    footerBuilt: "GitHub PagesでAI Dev Dayのために制作。応募はこのブース端末内に保存されます。",
    viewSource: "ソースを見る",
    closeHost: "ホスト画面を閉じる",
    hostConsole: "JAMES CAFE · ホスト画面",
    hostTitle: "ノブを回そう",
    hostDescription: "このブース端末に保存した応募からローカルで当選者を選びます。リセットするまで当選済みの方は除外されます。",
    readyLabel: "抽選準備OK",
    readyMeta: "応募を追加して、コーヒーマジックを始めよう。",
    noEntriesMeta: "保存された応募はまだありません。",
    exhaustedMeta: "全員が当選しました。履歴をリセットすると再抽選できます。",
    drawingLabel: "カプセルを混ぜています",
    drawingMeta: "保存した応募からランダムに選択中…",
    winnerLabel: "当選者が決まりました",
    winnerMeta: "焙煎したてのコーヒーをお楽しみください。",
    drawButton: "当選者を選ぶ",
    copyWinner: "名前をコピー",
    copiedWinner: "当選者名をコピーしました",
    historyTitle: "当選履歴",
    resetDraw: "リセット",
    historyEmpty: "この端末ではまだ抽選していません。",
    entryToolsTitle: "応募のバックアップ",
    loadDemo: "デモを読み込む",
    exitDemo: "デモを終了",
    statusDemo: "デモモード · メモリ内に{count}件のテスト応募があります。保存はされません。",
    demoLoaded: "{count}件のテスト応募でデモモードを開始しました",
    demoExited: "デモモードを終了し、保存済みの応募に戻りました。",
    exportEntries: "CSVを書き出す",
    clearEntries: "応募を全削除",
    confirmClear: "本当に全削除",
    exportEmpty: "書き出す前に応募を1件以上追加してください。",
    exportDone: "応募のバックアップをダウンロードしました",
    entriesCleared: "すべての応募と当選履歴を削除しました",
    demoEntriesCleared: "デモ応募を削除しました。保存済みの応募には影響ありません。",
    hostNote: "応募と当選履歴はこのブラウザだけに保存されます。ブラウザデータの削除や端末の変更前にCSVを書き出してください。",
    resetDone: "当選履歴をリセットしました",
    entrySaved: "カプセルを保存しました"
  }
};

const elements = {
  form: document.querySelector("#entry-form"),
  name: document.querySelector("#entrant-name"),
  nameError: document.querySelector("#name-error"),
  entryConfirm: document.querySelector("#entry-confirm"),
  addAnother: document.querySelector("#add-another"),
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
  demoMode: document.querySelector("#demo-mode"),
  exportEntries: document.querySelector("#export-entries"),
  clearEntries: document.querySelector("#clear-entries"),
  winnerCapsule: document.querySelector("#winner-capsule"),
  toast: document.querySelector("#toast")
};

const state = {
  entries: readStoredArray(ENTRY_STORAGE_KEY, isValidEntry),
  language: localStorage.getItem("james-cafe-language") || (navigator.language.startsWith("ja") ? "ja" : "en"),
  winnerHistory: readStoredArray(WINNER_STORAGE_KEY, isValidEntry),
  demoEntries: null,
  demoWinnerHistory: [],
  currentWinner: null,
  clearArmed: false
};

function isValidEntry(item) {
  return item && (typeof item.id === "string" || Number.isFinite(item.id)) && normalizeName(item.name).length >= 2;
}

function readStoredArray(key, validator) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter(validator) : [];
  } catch {
    return [];
  }
}

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

  updateMachineStatus();
  renderHistory();
  updateDrawAvailability();
  resetClearConfirmation();
}

function saveEntries() {
  try {
    localStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify(state.entries));
    return true;
  } catch {
    return false;
  }
}

function saveHistory() {
  localStorage.setItem(WINNER_STORAGE_KEY, JSON.stringify(state.winnerHistory));
}

function activeEntries() {
  return state.demoEntries ?? state.entries;
}

function activeWinnerHistory() {
  return state.demoEntries ? state.demoWinnerHistory : state.winnerHistory;
}

function updateMachineStatus() {
  const entries = activeEntries();
  const count = entries.length;
  elements.count.textContent = count.toLocaleString(state.language);
  elements.statusLight.className = `status-light${state.demoEntries ? " demo" : count ? " ready" : ""}`;
  if (state.demoEntries) {
    elements.status.textContent = t("statusDemo", { count: count.toLocaleString(state.language) });
    return;
  }
  elements.status.textContent = count
    ? t("statusReady", {
        count: count.toLocaleString(state.language),
        entryWord: count === 1 ? t("entrySingular") : t("entryPlural")
      })
    : t("statusEmpty");
}

function renderCapsules() {
  elements.chamber.replaceChildren();
  const visible = activeEntries().slice(-12);
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
  const entries = activeEntries();
  const available = availableEntries(entries, activeWinnerHistory());
  elements.drawButton.disabled = available.length === 0;
  elements.exportEntries.disabled = entries.length === 0;
  elements.clearEntries.disabled = entries.length === 0;
  elements.demoMode.textContent = t(state.demoEntries ? "exitDemo" : "loadDemo");
  elements.demoMode.classList.toggle("active", Boolean(state.demoEntries));

  if (state.currentWinner) return;
  if (entries.length === 0) {
    elements.drawMeta.textContent = t("noEntriesMeta");
  } else if (available.length === 0) {
    elements.drawMeta.textContent = t("exhaustedMeta");
  } else {
    elements.drawMeta.textContent = t("readyMeta");
  }
}

function renderHistory() {
  elements.historyList.replaceChildren();
  const history = activeWinnerHistory();
  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-history";
    empty.textContent = t("historyEmpty");
    elements.historyList.append(empty);
    return;
  }

  history.forEach((winner) => {
    const item = document.createElement("li");
    item.textContent = winner.name;
    elements.historyList.append(item);
  });
}

function addEntry(name) {
  const entries = activeEntries();
  if (hasEntryName(entries, name)) {
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("nameDuplicate");
    elements.name.focus();
    return;
  }

  const entry = createLocalEntry(name);
  entries.push(entry);
  if (!state.demoEntries && !saveEntries()) {
    entries.pop();
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("storageError");
    return;
  }

  elements.name.removeAttribute("aria-invalid");
  elements.nameError.textContent = "";
  elements.name.value = "";
  elements.entryConfirm.hidden = false;
  renderCapsules();
  updateMachineStatus();
  updateDrawAvailability();
  showToast(t("entrySaved"));
}

async function drawWinner() {
  const history = activeWinnerHistory();
  const available = availableEntries(activeEntries(), history);
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
  history.unshift(winner);
  if (!state.demoEntries) saveHistory();

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
  if (state.demoEntries) {
    state.demoWinnerHistory = [];
  } else {
    state.winnerHistory = [];
    saveHistory();
  }
  state.currentWinner = null;
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

function exportEntries() {
  const entries = activeEntries();
  if (!entries.length) {
    showToast(t("exportEmpty"));
    return;
  }

  const blob = new Blob([entriesToCsv(entries)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `james-cafe-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(t("exportDone"));
}

function requestClearEntries() {
  if (!state.clearArmed) {
    state.clearArmed = true;
    elements.clearEntries.textContent = t("confirmClear");
    elements.clearEntries.classList.add("armed");
    clearTimeout(requestClearEntries.timeout);
    requestClearEntries.timeout = setTimeout(resetClearConfirmation, 5000);
    return;
  }

  const wasDemo = Boolean(state.demoEntries);
  if (wasDemo) {
    state.demoEntries = [];
    state.demoWinnerHistory = [];
  } else {
    state.entries = [];
    state.winnerHistory = [];
    localStorage.removeItem(ENTRY_STORAGE_KEY);
    localStorage.removeItem(WINNER_STORAGE_KEY);
  }
  state.currentWinner = null;
  elements.entryConfirm.hidden = true;
  elements.winnerName.textContent = "—";
  elements.copyWinner.disabled = true;
  elements.drawDisplay.querySelector("p").textContent = t("readyLabel");
  elements.drawDisplay.classList.remove("winner", "drawing");
  renderCapsules();
  renderHistory();
  updateMachineStatus();
  updateDrawAvailability();
  resetClearConfirmation();
  showToast(t(wasDemo ? "demoEntriesCleared" : "entriesCleared"));
}

function toggleDemoMode() {
  if (state.demoEntries) {
    state.demoEntries = null;
    state.demoWinnerHistory = [];
    showToast(t("demoExited"));
  } else {
    state.demoEntries = createDemoEntries(DEMO_NAMES);
    state.demoWinnerHistory = [];
    showToast(t("demoLoaded", { count: DEMO_NAMES.length.toLocaleString(state.language) }));
  }

  state.currentWinner = null;
  elements.entryConfirm.hidden = true;
  elements.winnerName.textContent = "—";
  elements.copyWinner.disabled = true;
  elements.drawDisplay.querySelector("p").textContent = t("readyLabel");
  elements.drawDisplay.classList.remove("winner", "drawing");
  resetClearConfirmation();
  renderCapsules();
  renderHistory();
  updateMachineStatus();
  updateDrawAvailability();
}

function resetClearConfirmation() {
  state.clearArmed = false;
  if (!elements.clearEntries) return;
  elements.clearEntries.textContent = t("clearEntries");
  elements.clearEntries.classList.remove("armed");
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
  const name = normalizeName(elements.name.value);
  if (name.length < 2) {
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("nameTooShort");
    elements.name.focus();
    return;
  }
  addEntry(name);
});

elements.name.addEventListener("blur", () => {
  if (elements.name.value && normalizeName(elements.name.value).length < 2) {
    elements.name.setAttribute("aria-invalid", "true");
    elements.nameError.textContent = t("nameTooShort");
  }
});

elements.name.addEventListener("input", () => {
  if (normalizeName(elements.name.value).length >= 2) {
    elements.name.removeAttribute("aria-invalid");
    elements.nameError.textContent = "";
  }
});

elements.addAnother.addEventListener("click", () => {
  elements.entryConfirm.hidden = true;
  elements.name.focus();
});
elements.hostTrigger.addEventListener("click", () => elements.hostDialog.showModal());
elements.drawButton.addEventListener("click", drawWinner);
elements.copyWinner.addEventListener("click", copyWinner);
elements.resetDraw.addEventListener("click", resetDraw);
elements.demoMode.addEventListener("click", toggleDemoMode);
elements.exportEntries.addEventListener("click", exportEntries);
elements.clearEntries.addEventListener("click", requestClearEntries);

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    localStorage.setItem("james-cafe-language", state.language);
    applyLanguage();
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === ENTRY_STORAGE_KEY) {
    state.entries = readStoredArray(ENTRY_STORAGE_KEY, isValidEntry);
    if (!state.demoEntries) {
      renderCapsules();
      updateMachineStatus();
      updateDrawAvailability();
    }
  }
});

applyLanguage();
renderCapsules();
