import test from "node:test";
import assert from "node:assert/strict";
import {
  availableEntries,
  dedupeEntries,
  makeIssueUrl,
  parseEntry,
  secureRandomIndex
} from "../core.mjs";

test("parseEntry accepts valid issue titles", () => {
  assert.deepEqual(
    parseEntry({
      id: 11,
      number: 3,
      title: "[Coffee Entry]  Ada Lovelace ",
      html_url: "https://github.com/example/repo/issues/3",
      created_at: "2026-07-19T00:00:00Z"
    }),
    {
      id: 11,
      number: 3,
      name: "Ada Lovelace",
      url: "https://github.com/example/repo/issues/3",
      createdAt: "2026-07-19T00:00:00Z"
    }
  );
});

test("parseEntry ignores pull requests and unrelated issues", () => {
  assert.equal(parseEntry({ title: "[Coffee Entry] Ada", pull_request: {} }), null);
  assert.equal(parseEntry({ title: "Fix capsule animation" }), null);
});

test("parseEntry falls back to issue form body", () => {
  const entry = parseEntry({
    id: 12,
    number: 4,
    title: "[Coffee Entry]",
    body: "### Your name\n\nGrace Hopper\n\n### Agreement\n\nYes"
  });
  assert.equal(entry.name, "Grace Hopper");
});

test("dedupeEntries normalizes names case-insensitively", () => {
  const entries = [
    { id: 1, name: "Ada" },
    { id: 2, name: "Ａｄａ" },
    { id: 3, name: "Grace" }
  ];
  assert.deepEqual(dedupeEntries(entries).map((entry) => entry.id), [1, 3]);
});

test("availableEntries skips prior winners by issue id", () => {
  const entries = [{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }];
  assert.deepEqual(availableEntries(entries, [{ id: 1, name: "Ada" }]), [{ id: 2, name: "Grace" }]);
});

test("secureRandomIndex uses unbiased values in range", () => {
  const index = secureRandomIndex(3, (values) => {
    values[0] = 8;
    return values;
  });
  assert.equal(index, 2);
  assert.throws(() => secureRandomIndex(0), RangeError);
});

test("makeIssueUrl preselects the template and encoded title", () => {
  const url = new URL(makeIssueUrl("owner/repo", "山田 太郎"));
  assert.equal(url.pathname, "/owner/repo/issues/new");
  assert.equal(url.searchParams.get("template"), "coffee-entry.yml");
  assert.equal(url.searchParams.get("title"), "[Coffee Entry] 山田 太郎");
});
