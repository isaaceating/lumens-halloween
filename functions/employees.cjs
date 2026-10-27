'use strict';
const C = require('./core.cjs');

function importEmployees(state, body, secret, now) {
  C.assert(C.clock(state, now).status === 'scheduled' && !Object.keys(state.votes).length, '名單僅能在活動開始前匯入');
  const mode = body.mode ?? 'merge';
  C.assert(['merge', 'replace'].includes(mode), '匯入模式不正確');
  if (mode === 'replace') {
    C.assert(body.confirmReplace === true, '整份取代需要確認');
    C.assert(body.revision === state.revision, '資料已更新，請重新整理後再確認取代', 409);
  }
  C.assert(Array.isArray(body.ids) && body.ids.length > 0 && body.ids.length <= 2000, '請提供 1–2000 筆工號');
  const incoming = new Map();
  for (const row of body.ids) {
    const object = typeof row === 'object' && row !== null;
    const key = C.keyFor(secret, 'employee', C.employeeId(object ? row.id : row));
    let profile = incoming.get(key) || state.employeeProfiles?.[key];
    if (object) {
      C.assert(typeof row.name === 'string' && row.name.trim() && row.name.length <= 80 && typeof row.department === 'string' && row.department.length <= 120, '姓名或部門格式不正確');
      profile = {name: row.name.trim(), department: row.department.trim()};
    }
    incoming.set(key, profile);
  }
  const previous = new Set(state.employees);
  const employees = mode === 'merge' ? new Set(previous) : new Set();
  const profiles = mode === 'merge' ? {...state.employeeProfiles} : {};
  let added = 0, updated = 0;
  for (const [key, profile] of incoming) {
    if (!previous.has(key)) added++;
    else if (profile && JSON.stringify(profile) !== JSON.stringify(state.employeeProfiles?.[key])) updated++;
    employees.add(key);
    if (profile) profiles[key] = profile;
  }
  C.assert(employees.size <= 2000, '合併後名單超過 2,000 人上限');
  const removed = [...previous].filter(key => !employees.has(key)).length;
  state.employees = [...employees];
  state.employeeProfiles = profiles;
  state.revision++;
  return {mode, added, updated, removed, total: employees.size};
}
module.exports = {importEmployees};
