export function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 60);
}

export function hasEntryName(entries, name) {
  const key = normalizeName(name).normalize("NFKC").toLocaleLowerCase();
  return entries.some((entry) => normalizeName(entry.name).normalize("NFKC").toLocaleLowerCase() === key);
}

export function createLocalEntry(name, id = crypto.randomUUID(), createdAt = new Date().toISOString()) {
  const normalizedName = normalizeName(name);
  if (normalizedName.length < 2) {
    throw new RangeError("name must contain at least 2 characters");
  }

  return {
    id,
    name: normalizedName,
    createdAt
  };
}

export function createDemoEntries(names, createdAt = new Date().toISOString()) {
  return names.map((name, index) => createLocalEntry(name, `demo-${index + 1}`, createdAt));
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

export function entriesToCsv(entries) {
  const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = entries.map((entry) => [
    escapeCell(entry.name),
    escapeCell(entry.createdAt)
  ].join(","));
  return `\uFEFFName,Entered at\n${rows.join("\n")}\n`;
}
