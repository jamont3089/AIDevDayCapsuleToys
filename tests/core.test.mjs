import test from "node:test";
import assert from "node:assert/strict";
import {
  availableEntries,
  createLocalEntry,
  entriesToCsv,
  hasEntryName,
  normalizeName,
  secureRandomIndex
} from "../core.mjs";

test("normalizeName trims, collapses whitespace, and limits length", () => {
  assert.equal(normalizeName("  Ada   Lovelace  "), "Ada Lovelace");
  assert.equal(normalizeName("A".repeat(80)).length, 60);
});

test("createLocalEntry creates a stable local record", () => {
  assert.deepEqual(
    createLocalEntry(" Grace Hopper ", "entry-1", "2026-07-19T14:00:00.000Z"),
    {
      id: "entry-1",
      name: "Grace Hopper",
      createdAt: "2026-07-19T14:00:00.000Z"
    }
  );
  assert.throws(() => createLocalEntry("A"), RangeError);
});

test("hasEntryName normalizes full-width and case variants", () => {
  const entries = [{ id: "1", name: "Ada" }];
  assert.equal(hasEntryName(entries, "Ａｄａ"), true);
  assert.equal(hasEntryName(entries, "Grace"), false);
});

test("availableEntries skips prior winners by local entry id", () => {
  const entries = [{ id: "1", name: "Ada" }, { id: "2", name: "Grace" }];
  assert.deepEqual(availableEntries(entries, [{ id: "1", name: "Ada" }]), [{ id: "2", name: "Grace" }]);
});

test("secureRandomIndex uses unbiased values in range", () => {
  const index = secureRandomIndex(3, (values) => {
    values[0] = 8;
    return values;
  });
  assert.equal(index, 2);
  assert.throws(() => secureRandomIndex(0), RangeError);
});

test("entriesToCsv escapes spreadsheet values and includes timestamps", () => {
  const csv = entriesToCsv([
    { id: "1", name: "Ada, \"Countess\"", createdAt: "2026-07-19T14:00:00.000Z" }
  ]);
  assert.equal(csv, "\uFEFFName,Entered at\n\"Ada, \"\"Countess\"\"\",\"2026-07-19T14:00:00.000Z\"\n");
});
