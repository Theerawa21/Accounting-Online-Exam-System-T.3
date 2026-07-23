const CONFIG = Object.freeze({
  SPREADSHEET_ID: 'PUT_YOUR_SPREADSHEET_ID_HERE',
  RESULTS_SHEET: 'ผลสอบ',
  DELETED_RESULTS_SHEET: 'ผลสอบที่ลบ',
  ATTEMPTS_SHEET: 'คำตอบชั่วคราว',
  ROSTER_SHEET: 'ทะเบียนนักเรียน',
  EXAM_MINUTES: 40,
  QUESTION_COUNT: 40,
  TEACHER_SESSION_SECONDS: 21600,
  INITIAL_TEACHER_PIN: 'CHANGE-ME-2569'
});

const RESULT_HEADERS = ['วันเวลาส่ง','เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','ชุดข้อสอบ','คะแนน','คะแนนเต็ม','ร้อยละ','เวลาที่ใช้ (วินาที)','ส่งอัตโนมัติ','Attempt Token','จำนวนออกจากหน้าสอบ','เหตุผลส่ง'];
const DELETED_RESULT_HEADERS = ['เวลาที่ลบโดยครู'].concat(RESULT_HEADERS);
const ATTEMPT_HEADERS = ['Attempt Token','เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','ชุดข้อสอบ','เวลาเริ่ม','กำหนดส่ง','คำตอบ JSON','สถานะ','เวลาส่ง','บันทึกล่าสุด','เวลาที่ใช้ (วินาที)','จำนวนออกจากหน้าสอบ','บันทึกเหตุผิดปกติ JSON'];
const ROSTER_HEADERS = ['เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','สถานะ'];

function doGet(e) {
  if (e && e.parameter && e.parameter.api === '1') return rpcScriptResponse_(e);
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Accounting Fundamentals Online Examination System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function doPost(e) {
  const parentOrigin = allowedParentOrigin_(e && e.parameter && e.parameter.parentOrigin);
  const response = parentOrigin
    ? handleRpcRequest_(e)
    : rpcError_(e, new Error('ไม่อนุญาตให้เชื่อมต่อจากเว็บไซต์นี้'));
  return rpcHtmlResponse_(response, parentOrigin || 'https://theerawa21.github.io');
}

function rpcScriptResponse_(e) {
  const callback = String(e && e.parameter && e.parameter.callback || '');
  if (!/^[A-Za-z_$][0-9A-Za-z_$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput('/* callback ไม่ถูกต้อง */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(callback + '(' + rpcJson_(handleRpcRequest_(e)) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function handleRpcRequest_(e) {
  const requestId = rpcRequestId_(e);
  try {
    const action = String(e && e.parameter && e.parameter.action || '').trim();
    const methods = {
      lookupStudent: lookupStudent,
      startExam: startExam,
      resumeExam: resumeExam,
      saveAnswers: saveAnswers,
      submitExam: submitExam,
      teacherLogin: teacherLogin,
      getTeacherDashboard: getTeacherDashboard,
      deleteStudentResult: deleteStudentResult,
      setExamOpen: setExamOpen,
      teacherLogout: teacherLogout,
      recordExamViolation: recordExamViolation
    };
    if (!Object.prototype.hasOwnProperty.call(methods, action)) throw new Error('ไม่พบคำสั่งที่ร้องขอ');
    const rawPayload = String(e && e.parameter && e.parameter.payload || '[]');
    if (rawPayload.length > 12000) throw new Error('ข้อมูลที่ส่งมีขนาดใหญ่เกินกำหนด');
    const args = JSON.parse(rawPayload);
    if (!Array.isArray(args)) throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
    return { channel: 'accounting-exam-rpc-v1', requestId: requestId, ok: true, result: methods[action].apply(null, args) };
  } catch (error) {
    return rpcError_(e, error);
  }
}

function rpcRequestId_(e) {
  return String(e && e.parameter && e.parameter.requestId || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80);
}

function rpcError_(e, error) {
  return {
    channel: 'accounting-exam-rpc-v1',
    requestId: rpcRequestId_(e),
    ok: false,
    error: error && error.message ? error.message : String(error)
  };
}

function rpcJson_(response) {
  return JSON.stringify(response).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function allowedParentOrigin_(origin) {
  origin = String(origin || '').toLowerCase().replace(/\/$/, '');
  if (origin === 'https://theerawa21.github.io') return origin;
  if (/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return origin;
  return '';
}

function rpcHtmlResponse_(response, parentOrigin) {
  const payload = rpcJson_(response);
  const target = JSON.stringify(parentOrigin);
  const html = '<!doctype html><html><head><meta charset="UTF-8"></head><body>' +
    '<script>window.top.postMessage(' + payload + ',' + target + ');</script></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupSystem() {
  if (CONFIG.SPREADSHEET_ID === 'PUT_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('กรุณาตั้งค่า CONFIG.SPREADSHEET_ID ก่อนใช้งาน');
  }
  if (CONFIG.INITIAL_TEACHER_PIN.indexOf('CHANGE-ME') === 0) {
    throw new Error('กรุณาเปลี่ยน CONFIG.INITIAL_TEACHER_PIN ก่อนใช้งาน');
  }
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  ss.setSpreadsheetTimeZone('Asia/Bangkok');
  const results = ensureSheet_(ss, CONFIG.RESULTS_SHEET, RESULT_HEADERS);
  ensureSheet_(ss, CONFIG.DELETED_RESULTS_SHEET, DELETED_RESULT_HEADERS);
  const attempts = ensureSheet_(ss, CONFIG.ATTEMPTS_SHEET, ATTEMPT_HEADERS);
  const roster = ensureSheet_(ss, CONFIG.ROSTER_SHEET, ROSTER_HEADERS);
  attempts.hideSheet();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('TEACHER_PIN_HASH')) setTeacherPin_(CONFIG.INITIAL_TEACHER_PIN);
  if (!props.getProperty('EXAM_OPEN')) props.setProperty('EXAM_OPEN', '1');
  props.setProperty('SYSTEM_READY', new Date().toISOString());
  return { ok: true, spreadsheetUrl: ss.getUrl(), resultSheet: results.getName(), rosterSheet: roster.getName() };
}

function resetTeacherPinFromConfig() {
  setTeacherPin_(CONFIG.INITIAL_TEACHER_PIN);
  return { ok: true };
}

function lookupStudent(studentId) {
  const id = clean_(studentId, 20);
  if (!/^[0-9]{4,12}$/.test(id)) throw new Error('กรุณากรอกเลขประจำตัวเป็นตัวเลข 4–12 หลัก');
  const student = findRosterStudent_(id);
  if (!student) throw new Error('ไม่พบเลขประจำตัวนี้ในทะเบียน กรุณาตรวจสอบหรือติดต่อครูผู้สอน');
  return Object.assign({}, student);
}

function startExam(payload) {
  const student = validateStudent_(payload);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ctx = getContext_();
    if (findResultByStudentId_(ctx.results, student.studentId)) {
      throw new Error('เลขประจำตัวนี้ส่งข้อสอบแล้ว ไม่สามารถสอบซ้ำได้');
    }

    const active = findActiveAttemptByStudentId_(ctx.attempts, student.studentId);
    if (active) {
      if (active.fullName !== student.fullName || active.room !== student.room || String(active.number) !== String(student.number)) {
        throw new Error('เลขประจำตัวนี้มีการเริ่มสอบแล้ว กรุณาติดต่อครูผู้สอน');
      }
      return attemptResponse_(active);
    }

    if (!isExamOpen_()) {
      throw new Error('ขณะนี้ครูปิดรับการสอบ กรุณารอประกาศจากครูผู้สอน');
    }

    const token = Utilities.getUuid();
    const setNumber = 1 + (positiveHash_(student.studentId + ':' + token) % 5);
    const startedAt = new Date();
    const deadline = new Date(startedAt.getTime() + CONFIG.EXAM_MINUTES * 60000);
    ctx.attempts.appendRow([
      token, student.studentId, student.fullName, student.number, student.room, setNumber,
      startedAt, deadline, '{}', 'กำลังสอบ', '', startedAt, 0, 0, '[]'
    ]);
    return attemptResponse_({
      token, studentId: student.studentId, fullName: student.fullName, number: student.number,
      room: student.room, setNumber, startedAt, deadline, answers: {}, status: 'กำลังสอบ'
    });
  } finally {
    lock.releaseLock();
  }
}

function resumeExam(token) {
  token = clean_(token, 80);
  if (!token) return null;
  const ctx = getContext_();
  const attempt = findAttemptByToken_(ctx.attempts, token);
  if (!attempt || attempt.status === 'ส่งแล้ว') return null;
  if (Date.now() >= attempt.deadline.getTime()) {
    const result = submitExam(token, attempt.answers || {}, true);
    return { expired: true, result: result };
  }
  return attemptResponse_(attempt);
}

function saveAnswers(token, answers) {
  token = clean_(token, 80);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ctx = getContext_();
    const attempt = findAttemptByToken_(ctx.attempts, token);
    if (!attempt || attempt.status !== 'กำลังสอบ') throw new Error('ไม่พบการสอบที่กำลังดำเนินอยู่');
    if (Date.now() >= attempt.deadline.getTime()) {
      lock.releaseLock();
      return submitExam(token, answers || {}, true);
    }
    const normalized = normalizeAnswers_(attempt, answers);
    ctx.attempts.getRange(attempt.row, 9, 1, 4).setValues([[
      JSON.stringify(normalized), 'กำลังสอบ', '', new Date()
    ]]);
    return { ok: true, savedAt: new Date().toISOString(), answered: Object.keys(normalized).length };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function recordExamViolation(token, detail) {
  token = clean_(token, 80);
  detail = detail || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ctx = getContext_();
    const attempt = findAttemptByToken_(ctx.attempts, token);
    if (!attempt || attempt.status !== 'กำลังสอบ') throw new Error('ไม่พบข้อมูลการสอบที่กำลังทำ');
    const nextCount = Math.min(3, Math.max(attempt.violationCount, Number(detail.count || attempt.violationCount + 1)));
    const log = Array.isArray(attempt.violationLog) ? attempt.violationLog.slice(-19) : [];
    log.push({ type: clean_(detail.type || 'page_hidden', 40), occurredAt: clean_(detail.occurredAt || new Date().toISOString(), 40), durationMs: Math.max(0, Math.min(3600000, Number(detail.durationMs || 0))) });
    ctx.attempts.getRange(attempt.row, 14, 1, 2).setValues([[nextCount, JSON.stringify(log)]]);
    return { ok: true, count: nextCount };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function submitExam(token, answers, autoSubmitted, metadata) {
  token = clean_(token, 80);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ctx = getContext_();
    const previous = findResultByToken_(ctx.results, token);
    if (previous) return resultResponse_(previous);
    const attempt = findAttemptByToken_(ctx.attempts, token);
    if (!attempt) throw new Error('ไม่พบข้อมูลการสอบ');
    if (findResultByStudentId_(ctx.results, attempt.studentId)) {
      throw new Error('เลขประจำตัวนี้ส่งข้อสอบแล้ว');
    }

    const normalized = normalizeAnswers_(attempt, answers || attempt.answers || {});
    const questions = makeSet_(attempt.setNumber - 1, token);
    let score = 0;
    questions.forEach(function(q) {
      if (Number(normalized[q.id]) === q.correctIndex) score += 1;
    });

    const submittedAt = new Date();
    const duration = Math.max(0, Math.min(
      CONFIG.EXAM_MINUTES * 60,
      Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
    ));
    const percent = score / CONFIG.QUESTION_COUNT * 100;
    metadata = metadata || {};
    const violationCount = Math.max(attempt.violationCount, Math.min(3, Number(metadata.violationCount || 0)));
    const submissionReason = clean_(metadata.reason || (autoSubmitted === true ? 'time' : 'manual'), 40);
    const row = [
      submittedAt, attempt.studentId, attempt.fullName, attempt.number, attempt.room,
      attempt.setNumber, score, CONFIG.QUESTION_COUNT, percent, duration,
      autoSubmitted === true ? 'ใช่' : 'ไม่ใช่', token, violationCount, submissionReason
    ];
    ctx.results.appendRow(row);
    ctx.attempts.getRange(attempt.row, 9, 1, 5).setValues([[
      JSON.stringify(normalized), 'ส่งแล้ว', submittedAt, submittedAt, duration
    ]]);
    return {
      studentId: attempt.studentId,
      fullName: attempt.fullName,
      number: attempt.number,
      room: attempt.room,
      setNumber: attempt.setNumber,
      score: score,
      total: CONFIG.QUESTION_COUNT,
      percent: percent,
      durationSeconds: duration,
      submittedAt: submittedAt.toISOString(),
      autoSubmitted: autoSubmitted === true,
      violationCount: violationCount,
      submissionReason: submissionReason
    };
  } finally {
    lock.releaseLock();
  }
}

function teacherLogin(pin) {
  pin = clean_(pin, 100);
  const props = PropertiesService.getScriptProperties();
  const expected = props.getProperty('TEACHER_PIN_HASH');
  if (!expected) throw new Error('ระบบยังไม่ได้ตั้งค่ารหัสครู กรุณารัน setupSystem() ก่อน');
  const cache = CacheService.getScriptCache();
  const failKey = 'teacher_fail';
  const failures = Number(cache.get(failKey) || 0);
  if (failures >= 8) throw new Error('มีการลองรหัสหลายครั้งเกินไป กรุณารอ 10 นาที');
  if (hashPin_(pin) !== expected) {
    cache.put(failKey, String(failures + 1), 600);
    throw new Error('รหัสครูไม่ถูกต้อง');
  }
  cache.remove(failKey);
  const token = Utilities.getUuid() + Utilities.getUuid();
  cache.put('teacher:' + token, '1', CONFIG.TEACHER_SESSION_SECONDS);
  return { token: token, expiresIn: CONFIG.TEACHER_SESSION_SECONDS };
}

function getTeacherDashboard(token, filters) {
  requireTeacher_(token);
  filters = filters || {};
  const room = clean_(filters.room, 20);
  const setNumber = Number(filters.setNumber || 0);
  const query = clean_(filters.query, 120).toLowerCase();
  const ctx = getContext_();
  const lastRow = ctx.results.getLastRow();
  let rows = [];
  if (lastRow > 1) {
    const values = ctx.results.getRange(2, 1, lastRow - 1, RESULT_HEADERS.length).getValues();
    rows = values.map(resultObject_).filter(function(row) {
      if (room && room !== 'all' && row.room !== room) return false;
      if (setNumber && row.setNumber !== setNumber) return false;
      if (query && (row.studentId + ' ' + row.fullName + ' ' + row.number).toLowerCase().indexOf(query) === -1) return false;
      return true;
    }).sort(function(a, b) { return b.submittedAt.localeCompare(a.submittedAt); });
  }
  const allCount = Math.max(0, lastRow - 1);
  const avg = rows.length ? rows.reduce(function(sum, r) { return sum + r.score; }, 0) / rows.length : 0;
  const autoCount = rows.filter(function(r) { return r.autoSubmitted; }).length;
  return {
    rows: rows,
    summary: { shown: rows.length, total: allCount, average: avg, autoSubmitted: autoCount,
      flagged: rows.filter(function(r) { return r.violationCount > 0; }).length },
    examOpen: isExamOpen_(),
    syncedAt: new Date().toISOString()
  };
}

function setExamOpen(token, open) {
  requireTeacher_(token);
  const examOpen = open === true;
  PropertiesService.getScriptProperties().setProperty('EXAM_OPEN', examOpen ? '1' : '0');
  return { ok: true, examOpen: examOpen, updatedAt: new Date().toISOString() };
}

function deleteStudentResult(token, studentId) {
  requireTeacher_(token);
  studentId = clean_(studentId, 20);
  if (!studentId) throw new Error('กรุณาระบุเลขประจำตัวนักเรียน');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const results = ensureSheet_(ss, CONFIG.RESULTS_SHEET, RESULT_HEADERS);
    const deletedResults = ensureSheet_(ss, CONFIG.DELETED_RESULTS_SHEET, DELETED_RESULT_HEADERS);
    const lastRow = results.getLastRow();
    if (lastRow < 2) throw new Error('ไม่พบผลสอบของนักเรียนรายการนี้');

    const values = results.getRange(2, 1, lastRow - 1, RESULT_HEADERS.length).getValues();
    const rowsToDelete = [];
    const deletedAt = new Date();
    const archiveRows = [];
    values.forEach(function(row, index) {
      if (String(row[1]).trim() === studentId) {
        rowsToDelete.push(index + 2);
        archiveRows.push([deletedAt].concat(row));
      }
    });
    if (!rowsToDelete.length) throw new Error('ไม่พบผลสอบของนักเรียนรายการนี้');

    deletedResults.getRange(deletedResults.getLastRow() + 1, 1, archiveRows.length, DELETED_RESULT_HEADERS.length).setValues(archiveRows);
    rowsToDelete.sort(function(a, b) { return b - a; }).forEach(function(rowNumber) {
      results.deleteRow(rowNumber);
    });
    return { ok: true, deleted: rowsToDelete.length, studentId: studentId, deletedAt: deletedAt.toISOString() };
  } finally {
    lock.releaseLock();
  }
}

function teacherLogout(token) {
  if (token) CacheService.getScriptCache().remove('teacher:' + clean_(token, 100));
  return { ok: true };
}

function attemptResponse_(attempt) {
  const questions = makeSet_(attempt.setNumber - 1, attempt.token).map(function(q) {
    return { id: q.id, text: q.text, options: q.options };
  });
  return {
    token: attempt.token,
    student: {
      studentId: attempt.studentId,
      fullName: attempt.fullName,
      number: attempt.number,
      room: attempt.room
    },
    setNumber: attempt.setNumber,
    startedAt: attempt.startedAt instanceof Date ? attempt.startedAt.toISOString() : new Date(attempt.startedAt).toISOString(),
    deadline: attempt.deadline instanceof Date ? attempt.deadline.toISOString() : new Date(attempt.deadline).toISOString(),
    answers: attempt.answers || {},
    violationCount: Number(attempt.violationCount || 0),
    questions: questions,
    durationMinutes: CONFIG.EXAM_MINUTES
  };
}

function normalizeAnswers_(attempt, answers) {
  const questions = makeSet_(attempt.setNumber - 1, attempt.token);
  const allowed = {};
  questions.forEach(function(q) { allowed[q.id] = q.options.length; });
  const normalized = {};
  if (answers && typeof answers === 'object') {
    Object.keys(answers).forEach(function(id) {
      const index = Number(answers[id]);
      if (allowed[id] && Number.isInteger(index) && index >= 0 && index < allowed[id]) normalized[id] = index;
    });
  }
  return normalized;
}

function makeSet_(setIndex, seed) {
  const conceptPool = [].concat.apply([], conceptSets);
  const classificationPool = [].concat.apply([], classItems);
  const c = rotate_(conceptPool, setIndex * 6).slice(0, 10).map(function(x, n) {
    return question_(seed, 'c' + setIndex + '-' + n, x[0], x[1], [x[1]].concat(x[2]));
  });
  const d = rotate_(classificationPool, setIndex * 17).slice(0, 15).map(function(x, n) {
    const correct = TYPES[x[1]];
    const distractors = seededShuffle_(TYPES.filter(function(_, j) { return j !== x[1]; }), seed + ':d:' + n).slice(0, 3);
    return question_(seed, 'd' + setIndex + '-' + n, 'รายการ “' + x[0] + '” จัดอยู่ในประเภทใด', correct, [correct].concat(distractors));
  });
  const e = rotate_(extraQuestions, setIndex * 5).slice(0, 15).map(function(x, n) {
    return question_(seed, 'e' + setIndex + '-' + n, x[0], x[1], [x[1]].concat(x[2]));
  });
  return seededShuffle_(c.concat(d, e), seed + ':questions');
}

function question_(seed, id, text, answer, options) {
  const shuffled = seededShuffle_(options, seed + ':options:' + id);
  return { id: id, text: text, options: shuffled, correctIndex: shuffled.indexOf(answer) };
}

function rotate_(arr, n) {
  const offset = n % arr.length;
  return arr.slice(offset).concat(arr.slice(0, offset));
}

function seededShuffle_(arr, seedText) {
  const copy = arr.slice();
  let seed = positiveHash_(seedText) || 1;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  return copy;
}

function positiveHash_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8);
  return (((bytes[0] & 255) << 24) | ((bytes[1] & 255) << 16) | ((bytes[2] & 255) << 8) | (bytes[3] & 255)) >>> 0;
}

function validateStudent_(payload) {
  payload = payload || {};
  const studentId = clean_(payload.studentId, 20);
  if (!/^[0-9]{4,12}$/.test(studentId)) throw new Error('กรุณากรอกเลขประจำตัวเป็นตัวเลข 4–12 หลัก');
  const student = findRosterStudent_(studentId);
  if (!student) throw new Error('ไม่พบเลขประจำตัวนี้ในทะเบียน กรุณาตรวจสอบหรือติดต่อครูผู้สอน');
  return Object.assign({}, student);
}

function findRosterStudent_(studentId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'roster:' + String(studentId);
  const cached = cache.get(cacheKey);
  if (cached) {
    if (cached === 'null') return null;
    try { return JSON.parse(cached); } catch (error) {}
  }
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ROSTER_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ROSTER_HEADERS.length).getDisplayValues();
  const id = String(studentId);
  const row = rows.find(values => clean_(values[0], 20) === id);
  if (!row) {
    cache.put(cacheKey, 'null', 300);
    return null;
  }
  const student = {
    studentId: clean_(row[0], 20),
    fullName: clean_(row[1], 120),
    number: clean_(row[2], 4),
    room: clean_(row[3], 20)
  };
  if (student.fullName.length < 4 || !/^[0-9]{1,3}$/.test(student.number)) return null;
  if (['ม.4/3','ม.4/4'].indexOf(student.room) === -1) return null;
  if (row[4] && ['กำลังศึกษาอยู่','นักเรียนเข้าใหม่','active'].indexOf(clean_(row[4], 40).toLowerCase()) === -1) return null;
  cache.put(cacheKey, JSON.stringify(student), 3600);
  return student;
}

function getContext_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const results = ss.getSheetByName(CONFIG.RESULTS_SHEET);
  const attempts = ss.getSheetByName(CONFIG.ATTEMPTS_SHEET);
  if (!results || !attempts) throw new Error('ระบบฐานข้อมูลยังไม่พร้อม กรุณาให้ครูรัน setupSystem()');
  return {
    ss: ss,
    results: results,
    attempts: attempts
  };
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    const first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0 && ss.getSheets().length === 1) {
      first.setName(name);
      sheet = first;
    } else {
      sheet = ss.insertSheet(name);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#082B5C').setFontColor('#FFFFFF').setFontWeight('bold');
    sheet.autoResizeColumns(1, headers.length);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function findAttemptByToken_(sheet, token) {
  const row = findRowByValue_(sheet, 1, token);
  return row ? attemptObject_(sheet.getRange(row, 1, 1, ATTEMPT_HEADERS.length).getValues()[0], row) : null;
}

function findActiveAttemptByStudentId_(sheet, studentId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const values = sheet.getRange(2, 1, lastRow - 1, ATTEMPT_HEADERS.length).getValues();
  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (String(values[i][1]) === studentId && values[i][9] === 'กำลังสอบ') return attemptObject_(values[i], i + 2);
  }
  return null;
}

function attemptObject_(v, row) {
  let answers = {};
  try { answers = JSON.parse(v[8] || '{}'); } catch (error) {}
  return {
    row: row, token: String(v[0]), studentId: String(v[1]), fullName: String(v[2]),
    number: String(v[3]), room: String(v[4]), setNumber: Number(v[5]),
    startedAt: new Date(v[6]), deadline: new Date(v[7]), answers: answers,
    status: String(v[9] || ''), submittedAt: v[10] ? new Date(v[10]) : null,
    violationCount: Number(v[13] || 0), violationLog: parseJsonArray_(v[14])
  };
}

function findResultByStudentId_(sheet, studentId) {
  const row = findRowByValue_(sheet, 2, studentId);
  return row ? resultObject_(sheet.getRange(row, 1, 1, RESULT_HEADERS.length).getValues()[0]) : null;
}

function findResultByToken_(sheet, token) {
  const row = findRowByValue_(sheet, 12, token);
  return row ? resultObject_(sheet.getRange(row, 1, 1, RESULT_HEADERS.length).getValues()[0]) : null;
}

function findRowByValue_(sheet, column, value) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const found = sheet.getRange(2, column, lastRow - 1, 1)
    .createTextFinder(String(value)).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}

function resultObject_(v) {
  return {
    submittedAt: new Date(v[0]).toISOString(),
    studentId: String(v[1]), fullName: String(v[2]), number: String(v[3]),
    room: String(v[4]), setNumber: Number(v[5]), score: Number(v[6]),
    total: Number(v[7]), percent: Number(v[8]), durationSeconds: Number(v[9]),
    autoSubmitted: String(v[10]) === 'ใช่', token: String(v[11]),
    violationCount: Number(v[12] || 0), submissionReason: String(v[13] || '')
  };
}

function resultResponse_(row) {
  return {
    studentId: row.studentId, fullName: row.fullName, number: row.number, room: row.room,
    setNumber: row.setNumber, score: row.score, total: row.total, percent: row.percent,
    durationSeconds: row.durationSeconds, submittedAt: row.submittedAt,
    autoSubmitted: row.autoSubmitted,
    violationCount: row.violationCount,
    submissionReason: row.submissionReason
  };
}

function parseJsonArray_(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setTeacherPin_(pin) {
  if (!pin || String(pin).length < 6) throw new Error('รหัสครูต้องมีอย่างน้อย 6 ตัวอักษร');
  PropertiesService.getScriptProperties().setProperty('TEACHER_PIN_HASH', hashPin_(String(pin)));
}

function isExamOpen_() {
  return PropertiesService.getScriptProperties().getProperty('EXAM_OPEN') !== '0';
}

function hashPin_(pin) {
  const props = PropertiesService.getScriptProperties();
  let salt = props.getProperty('TEACHER_PIN_SALT');
  if (!salt) {
    salt = Utilities.getUuid();
    props.setProperty('TEACHER_PIN_SALT', salt);
  }
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + pin, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes);
}

function requireTeacher_(token) {
  token = clean_(token, 100);
  if (!token || CacheService.getScriptCache().get('teacher:' + token) !== '1') {
    throw new Error('เซสชันครูหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  }
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').trim().slice(0, maxLength);
}
