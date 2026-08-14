#!/usr/bin/env node
// Data and structure checks for index.html. No dependencies; run with: node scripts/validate.js
// Exits non-zero on any failure so it can gate CI.

const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

let failures = 0;
function check(ok, label) {
  console.log(`${ok ? "ok" : "FAIL"} - ${label}`);
  if (!ok) failures++;
}

const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
check(Boolean(scriptMatch), "page contains an inline script");
const script = scriptMatch ? scriptMatch[1] : "";

// Syntax check without executing DOM code.
let syntaxOk = true;
try {
  new Function(script);
} catch (error) {
  syntaxOk = false;
  console.error(error.message);
}
check(syntaxOk, "script parses without syntax errors");

// Execute only the data declarations (everything before the first function).
const ctx = {};
try {
  const dataOnly = script.slice(0, script.indexOf("function renderPlan"));
  new Function("ctx", `${dataOnly}; ctx.MODULES = MODULES; ctx.PLANS = PLANS; ctx.VERIFIED = VERIFIED;`)(ctx);
} catch (error) {
  console.error(error.message);
}
check(ctx.MODULES && ctx.PLANS && ctx.VERIFIED, "MODULES, PLANS and VERIFIED are defined");

const moduleIds = Object.keys(ctx.MODULES || {});
check(moduleIds.length === 12, `exactly 12 modules (found ${moduleIds.length})`);

const REQUIRED_FIELDS = ["code", "short", "full", "role", "url", "intake", "status"];
for (const id of moduleIds) {
  const module = ctx.MODULES[id];
  const missing = REQUIRED_FIELDS.filter(field => !module[field]);
  check(missing.length === 0, `${id} has all fields${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`);
  check(module.code === id, `${id} code matches its key`);
  check(/^https:\/\/academy\.smu\.edu\.sg\//.test(module.url), `${id} links to academy.smu.edu.sg`);
}

for (const [pace, plan] of Object.entries(ctx.PLANS || {})) {
  const used = plan.months.flatMap(month => month.ids);
  const unique = new Set(used);
  const unknown = used.filter(id => !ctx.MODULES[id]);
  check(used.length === 12 && unique.size === 12, `${pace}-month plan schedules all 12 modules exactly once`);
  check(unknown.length === 0, `${pace}-month plan references only known modules${unknown.length ? ` (unknown: ${unknown.join(", ")})` : ""}`);
  check(plan.months.length === Number(pace), `${pace}-month plan has ${pace} months`);
  check(plan.months.every(month => month.title && month.why), `${pace}-month plan months all have a title and rationale`);
}

// The verified date must parse, and every visible date placeholder must exist for it to fill.
const verifiedDate = new Date(ctx.VERIFIED || "");
check(!Number.isNaN(verifiedDate.getTime()), `VERIFIED ("${ctx.VERIFIED}") parses as a date`);
const spanCount = (html.match(/<span data-verified>/g) || []).length;
check(spanCount >= 3, `at least 3 data-verified spans in the HTML (found ${spanCount})`);

// Warn (without failing) when the snapshot looks stale.
const ageDays = Math.floor((Date.now() - verifiedDate.getTime()) / 86400000);
if (ageDays > 60) {
  console.warn(`warning - snapshot is ${ageDays} days old; reverify intakes against the official SMU Academy pages`);
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
