const ENTRY_PREFIX = "[Coffee Entry]";

export function parseEntry(issue) {
  if (!issue || issue.pull_request) return null;

  const title = String(issue.title || "").trim();
  if (!title.toLowerCase().startsWith(ENTRY_PREFIX.toLowerCase())) return null;

  let name = title.slice(ENTRY_PREFIX.length).replace(/^[:\s-]+/, "").trim();

  if (!name && issue.body) {
    const match = String(issue.body).match(/###\s*(?:Your name|Name|お名前)\s*\r?\n+([^\r\n]+)/i);
    name = match?.[1]?.trim() || "";
  }

  name = name.replace(/\s+/g, " ").slice(0, 60);
  if (name.length < 2) return null;

  return {
    id: Number(issue.id),
    number: Number(issue.number),
    name,
    url: String(issue.html_url || ""),
    createdAt: String(issue.created_at || "")
  };
}

export function dedupeEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry) return false;
    const key = entry.name.normalize("NFKC").toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function availableEntries(entries, winnerHistory) {
  const won = new Set(winnerHistory.map((winner) => winner.id));
  return entries.filter((entry) => !won.has(entry.id));
}

export function secureRandomIndex(length, getRandomValues = crypto.getRandomValues.bind(crypto)) {
  if (!Number.isSafeInteger(length) || length <= 0) {
    throw new RangeError("length must be a positive safe integer");
  }

  const range = 0x1_0000_0000;
  const limit = range - (range % length);
  const values = new Uint32Array(1);

  do {
    getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % length;
}

export function makeIssueUrl(repo, name) {
  const params = new URLSearchParams({
    template: "coffee-entry.yml",
    title: `${ENTRY_PREFIX} ${name}`
  });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}
