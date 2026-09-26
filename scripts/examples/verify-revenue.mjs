import assert from "node:assert/strict";
import { revenueReport } from "../../src/data/workspace/revenue-report.ts";

const monthly = revenueReport("Monthly");
const quarterly = revenueReport("Quarterly");

assert.equal(monthly.series.length, 12);
assert.equal(monthly.series[0].label, "Jan");
assert.equal(monthly.series[11].label, "Dec");
assert.deepEqual(quarterly.series, [
  { label: "Q1", value: 10400 },
  { label: "Q2", value: 14100 },
  { label: "Q3", value: 16600 },
  { label: "Q4", value: 20600 },
]);
for (const report of [monthly, quarterly]) {
  assert.equal(
    report.total,
    61700,
    "Grouping must preserve the full reporting year",
  );
  assert.equal(report.rows.length, report.series.length + 2);
  assert.ok(report.rows.slice(1).every(([label]) => label.endsWith("2026")));
  assert.equal(
    report.rows.slice(1, -1).reduce((sum, row) => sum + Number(row[1]), 0),
    report.total,
    "CSV data must agree with the chart summary",
  );
  assert.deepEqual(report.rows.at(-1), ["Total 2026", "61700"]);
}
assert.equal(
  revenueReport("Monthly").series.length,
  12,
  "Switching back restores all months",
);
console.log(
  "Verified monthly and quarterly revenue, reporting year, and CSV totals.",
);
