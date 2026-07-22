const TYPES=['สินทรัพย์หมุนเวียน','สินทรัพย์ไม่หมุนเวียน','หนี้สินหมุนเวียน','หนี้สินไม่หมุนเวียน','ทุน','รายได้','ถอนใช้ส่วนตัว'];
const conceptSets=[
[['ข้อใดอธิบายความหมายของ “สินทรัพย์” ได้ถูกต้อง','ทรัพยากรที่กิจการควบคุมและคาดว่าจะให้ประโยชน์ในอนาคต',['ภาระที่ต้องชำระ','สิทธิของเจ้าหนี้','ค่าใช้จ่ายส่วนตัว']],['สินทรัพย์ที่เปลี่ยนเป็นเงินสด ขาย หรือใช้หมดภายใน 1 ปี เรียกว่าอะไร','สินทรัพย์หมุนเวียน',['สินทรัพย์ไม่หมุนเวียน','หนี้สินหมุนเวียน','ทุน']],['ที่ดิน อาคาร และเครื่องจักร จัดเป็นรายการใด','สินทรัพย์ไม่หมุนเวียน',['สินทรัพย์หมุนเวียน','หนี้สินไม่หมุนเวียน','รายได้']],['ข้อใดคือความหมายของหนี้สิน','ภาระผูกพันที่กิจการต้องชำระในอนาคต',['ทรัพยากรของกิจการ','ผลตอบแทนจากการขาย','เงินที่เจ้าของลงทุน']],['หนี้สินที่ต้องชำระภายใน 1 ปี เรียกว่าอะไร','หนี้สินหมุนเวียน',['หนี้สินไม่หมุนเวียน','สินทรัพย์หมุนเวียน','ทุน']],['เงินกู้ที่มีกำหนดชำระภายใน 5 ปี จัดเป็นอะไร','หนี้สินไม่หมุนเวียน',['หนี้สินหมุนเวียน','สินทรัพย์ไม่หมุนเวียน','รายได้']],['ส่วนของเจ้าของคำนวณได้อย่างไร','สินทรัพย์ − หนี้สิน',['สินทรัพย์ + หนี้สิน','หนี้สิน − สินทรัพย์','รายได้ − ทุน']],['เงินสดหรือสินทรัพย์ที่เจ้าของนำมาลงทุนเรียกว่าอะไร','ทุน',['รายได้','หนี้สิน','ถอนใช้ส่วนตัว']],['ผลตอบแทนจากการขายสินค้าหรือบริการเรียกว่าอะไร','รายได้',['ทุน','สินทรัพย์','ถอนใช้ส่วนตัว']],['เงินหรือสินทรัพย์ที่เจ้าของนำไปใช้ส่วนตัวเรียกว่าอะไร','ถอนใช้ส่วนตัว',['รายได้','ทุน','หนี้สิน']]],
[['สินทรัพย์แบ่งตามระยะเวลาการใช้ประโยชน์ได้กี่ประเภท','2 ประเภท',['3 ประเภท','4 ประเภท','5 ประเภท']],['เงินสดและเงินฝากธนาคารโดยทั่วไปจัดเป็นอะไร','สินทรัพย์หมุนเวียน',['สินทรัพย์ไม่หมุนเวียน','หนี้สินหมุนเวียน','ทุน']],['อาคารและอุปกรณ์สำนักงานจัดเป็นอะไร','สินทรัพย์ไม่หมุนเวียน',['สินทรัพย์หมุนเวียน','หนี้สินไม่หมุนเวียน','รายได้']],['ภาระผูกพันที่ต้องชำระในอนาคตเรียกว่าอะไร','หนี้สิน',['สินทรัพย์','รายได้','ทุน']],['เจ้าหนี้การค้าโดยทั่วไปจัดเป็นอะไร','หนี้สินหมุนเวียน',['หนี้สินไม่หมุนเวียน','สินทรัพย์หมุนเวียน','ทุน']],['เงินกู้กำหนดชำระภายใน 7 ปีจัดเป็นอะไร','หนี้สินไม่หมุนเวียน',['หนี้สินหมุนเวียน','สินทรัพย์ไม่หมุนเวียน','ถอนใช้ส่วนตัว']],['สิทธิส่วนที่เหลือของเจ้าของหลังหักหนี้สินเรียกว่าอะไร','ส่วนของเจ้าของ',['สินทรัพย์หมุนเวียน','รายได้','เจ้าหนี้']],['ผลตอบแทนจากการดำเนินงานเรียกว่าอะไร','รายได้',['ทุน','ถอนใช้ส่วนตัว','หนี้สิน']],['เมื่อกิจการมีรายได้ ส่วนของเจ้าของเป็นอย่างไร','เพิ่มขึ้น',['ลดลง','ไม่เปลี่ยนแปลง','เป็นศูนย์']],['เมื่อเจ้าของถอนเงินไปใช้ส่วนตัว ส่วนของเจ้าของเป็นอย่างไร','ลดลง',['เพิ่มขึ้น','ไม่เปลี่ยนแปลง','เป็นหนี้สิน']]],
[['ลูกหนี้การค้าและสินค้าคงเหลือจัดเป็นอะไร','สินทรัพย์หมุนเวียน',['สินทรัพย์ไม่หมุนเวียน','หนี้สินหมุนเวียน','ทุน']],['ที่ดิน อาคาร และเครื่องจักรจัดเป็นอะไร','สินทรัพย์ไม่หมุนเวียน',['สินทรัพย์หมุนเวียน','หนี้สินไม่หมุนเวียน','รายได้']],['เกณฑ์เวลาทั่วไปของสินทรัพย์หมุนเวียนคือเท่าใด','ไม่เกิน 1 ปี',['เกิน 1 ปี','ไม่เกิน 5 ปี','ไม่มีกำหนด']],['หนี้ที่ต้องชำระในรอบดำเนินงานเรียกว่าอะไร','หนี้สินหมุนเวียน',['หนี้สินไม่หมุนเวียน','สินทรัพย์หมุนเวียน','ทุน']],['เงินกู้ระยะยาวจัดเป็นอะไร','หนี้สินไม่หมุนเวียน',['หนี้สินหมุนเวียน','สินทรัพย์ไม่หมุนเวียน','รายได้']],['สมการบัญชีที่ถูกต้องคือข้อใด','สินทรัพย์ = หนี้สิน + ส่วนของเจ้าของ',['สินทรัพย์ = รายได้ + ค่าใช้จ่าย','หนี้สิน = สินทรัพย์ + ทุน','ทุน = หนี้สิน + รายได้']],['ทุนหมายถึงอะไร','เงินหรือสินทรัพย์ที่เจ้าของนำมาลงทุน',['เงินที่ถอนใช้ส่วนตัว','ผลตอบแทนจากลูกค้า','ภาระที่ต้องชำระ']],['รายได้มีผลต่อส่วนของเจ้าของอย่างไร','ทำให้เพิ่มขึ้น',['ทำให้ลดลง','ไม่เปลี่ยนแปลง','ทำให้เป็นศูนย์']],['ถอนใช้ส่วนตัวหมายถึงอะไร','เงินหรือสินทรัพย์ที่เจ้าของนำไปใช้ส่วนตัว',['ค่าใช้จ่ายของกิจการ','เงินกู้ของกิจการ','รายได้ของกิจการ']],['ถอนใช้ส่วนตัวมีผลต่อส่วนของเจ้าของอย่างไร','ทำให้ลดลง',['ทำให้เพิ่มขึ้น','ไม่เปลี่ยนแปลง','ทำให้เป็นหนี้สิน']]]
];
const classItems=[
[['เงินสด',0],['เงินฝากธนาคารประเภทออมทรัพย์',0],['ลูกหนี้การค้า',0],['ตั๋วเงินรับครบกำหนดภายใน 3 เดือน',0],['สินค้าคงเหลือ',0],['วัสดุสำนักงาน',0],['ค่าเช่าจ่ายล่วงหน้า 6 เดือน',0],['รายได้ค้างรับ',0],['เงินลงทุนระยะสั้น',0],['ที่ดิน',1],['อาคารสำนักงาน',1],['เครื่องจักร',1],['รถยนต์ส่งสินค้า',1],['เครื่องใช้สำนักงาน',1],['สิทธิบัตร',1],['เจ้าหนี้การค้า',2],['ตั๋วเงินจ่ายครบกำหนดภายใน 6 เดือน',2],['เงินกู้ยืมระยะสั้น',2],['ค่าไฟฟ้าค้างจ่าย',2],['เงินเดือนค้างจ่าย',2],['รายได้รับล่วงหน้า',2],['เงินกู้ธนาคารกำหนดชำระภายใน 5 ปี',3],['หุ้นกู้กำหนดชำระภายใน 10 ปี',3],['หนี้สินตามสัญญาเช่าระยะยาว',3],['เจ้าของนำเงินสดมาลงทุน',4],['เจ้าของนำอุปกรณ์สำนักงานมาลงทุน',4],['รายได้จากการขายสินค้า',5],['รายได้ค่าบริการ',5],['เจ้าของถอนเงินสดไปใช้ส่วนตัว',6],['เจ้าของนำสินค้าของกิจการไปใช้ที่บ้าน',6]],
[['เงินสดย่อย',0],['เงินฝากธนาคารกระแสรายวัน',0],['ลูกหนี้อื่น',0],['ตั๋วเงินรับครบกำหนดภายใน 10 เดือน',0],['สินค้าสำเร็จรูป',0],['วัตถุดิบคงเหลือ',0],['ค่าเบี้ยประกันจ่ายล่วงหน้า',0],['ดอกเบี้ยค้างรับ',0],['เงินลงทุนชั่วคราว',0],['ที่ดินที่ตั้งสำนักงาน',1],['อาคารโรงงาน',1],['อุปกรณ์คอมพิวเตอร์',1],['เฟอร์นิเจอร์สำนักงาน',1],['รถบรรทุก',1],['ลิขสิทธิ์',1],['เจ้าหนี้ค่าสินค้า',2],['ค่าน้ำประปาค้างจ่าย',2],['ภาษีค้างจ่าย',2],['ดอกเบี้ยค้างจ่าย',2],['ตั๋วเงินจ่ายครบกำหนดภายใน 1 ปี',2],['เงินกู้กำหนดชำระภายใน 8 เดือน',2],['เงินกู้จำนองกำหนดชำระภายใน 8 ปี',3],['หุ้นกู้ระยะยาว',3],['ภาระผูกพันผลประโยชน์พนักงานระยะยาว',3],['เจ้าของนำรถยนต์มาลงทุน',4],['เจ้าของนำเงินฝากธนาคารมาลงทุน',4],['รายได้ค่าเช่า',5],['รายได้ค่านายหน้า',5],['เจ้าของถอนเงินจากธนาคารไปใช้ส่วนตัว',6],['เจ้าของนำอุปกรณ์กิจการไปใช้ส่วนตัว',6]],
[['เงินฝากธนาคาร',0],['เช็ครับลงวันที่ภายใน 30 วัน',0],['ลูกหนี้การค้า',0],['สินค้าระหว่างผลิต',0],['วัสดุสิ้นเปลือง',0],['ค่าโฆษณาจ่ายล่วงหน้า',0],['ค่าบริการค้างรับ',0],['ตั๋วเงินรับครบกำหนดภายใน 1 ปี',0],['เงินลงทุนระยะสั้นในหลักทรัพย์',0],['อาคารร้านค้า',1],['เครื่องตกแต่งร้าน',1],['เครื่องถ่ายเอกสาร',1],['รถยนต์ของกิจการ',1],['เครื่องหมายการค้า',1],['เงินลงทุนระยะยาว',1],['เจ้าหนี้การค้า',2],['ค่าเช่าอาคารค้างจ่าย',2],['ค่าจ้างพนักงานค้างจ่าย',2],['เงินรับล่วงหน้าจากลูกค้า',2],['เงินกู้กำหนดชำระภายใน 4 เดือน',2],['หนี้ระยะยาวส่วนที่ถึงกำหนดใน 1 ปี',2],['เงินกู้ธนาคารกำหนดชำระภายใน 10 ปี',3],['หนี้ตามสัญญาเช่ากำหนดชำระภายใน 6 ปี',3],['ตั๋วเงินจ่ายระยะยาว',3],['เจ้าของนำอาคารมาลงทุน',4],['เจ้าของนำเครื่องจักรมาลงทุน',4],['รายได้ดอกเบี้ย',5],['รายได้จากการให้บริการ',5],['เจ้าของถอนเงินสดไปจ่ายส่วนตัว',6],['เจ้าของนำสินค้าของร้านไปให้เป็นของขวัญส่วนตัว',6]]
];
const extraQuestions=[
['ข้อใดอธิบายความหมายของการบัญชีได้ครบถ้วนที่สุด','การรวบรวม บันทึก จัดประเภท และจัดทำรายงานข้อมูลที่เกี่ยวข้องกับเงินตรา',['การขายสินค้าเพื่อให้ได้กำไร','การคำนวณภาษีเพียงอย่างเดียว','การจดบันทึกจำนวนสินค้าเท่านั้น']],
['เหตุการณ์ที่นำมาบันทึกบัญชีควรเกี่ยวข้องกับสิ่งใด','เงินตรา',['ความคิดเห็นส่วนบุคคล','ความชอบของเจ้าของ','จำนวนพนักงานเท่านั้น']],
['การจัดประเภทข้อมูลทางบัญชีมีจุดประสงค์สำคัญอย่างไร','จัดข้อมูลให้เป็นหมวดหมู่เพื่อจัดทำรายงานทางการเงิน',['ทำให้กิจการไม่ต้องเสียภาษี','ทำให้สินค้าเพิ่มขึ้นทันที','ใช้แทนเอกสารทุกประเภท']],
['วัตถุประสงค์สำคัญของการบัญชีคือข้อใด','รวบรวมข้อมูลทางการเงินเพื่อนำไปจัดทำรายงานทางการเงิน',['กำหนดราคาสินค้าแทนเจ้าของ','ตรวจนับพนักงานทุกวัน','ออกแบบบรรจุภัณฑ์สินค้า']],
['รายงานทางการเงินช่วยแสดงข้อมูลใด','ผลการดำเนินงานและฐานะทางการเงินของกิจการ',['ความนิยมของสินค้าเท่านั้น','จำนวนคู่แข่งในตลาดเท่านั้น','ความคิดเห็นของลูกค้าเท่านั้น']],
['บุคคลใดเป็นผู้ใช้ข้อมูลทางบัญชีภายในกิจการ','เจ้าของกิจการ',['ธนาคาร','กรมสรรพากร','เจ้าหนี้การค้า']],
['บุคคลใดเป็นผู้ใช้ข้อมูลทางบัญชีภายในกิจการอีกกลุ่มหนึ่ง','พนักงานในกิจการ',['ประชาชนทั่วไป','กรมพัฒนาธุรกิจการค้า','ลูกหนี้การค้า']],
['ข้อใดเป็นผู้ใช้ข้อมูลทางบัญชีภายนอกกิจการ','ธนาคาร',['เจ้าของกิจการ','ผู้จัดการฝ่ายบัญชี','พนักงานในกิจการ']],
['กรมสรรพากรใช้ข้อมูลทางบัญชีในฐานะใด','ผู้ใช้ข้อมูลภายนอกกิจการ',['ผู้ใช้ข้อมูลภายในกิจการ','เจ้าของกิจการ','พนักงานกิจการ']],
['เจ้าหนี้ของกิจการใช้ข้อมูลบัญชีเพื่อประโยชน์ใดมากที่สุด','ประเมินความสามารถในการชำระหนี้ของกิจการ',['กำหนดวันหยุดพนักงาน','ออกแบบสินค้าใหม่','จัดวางสินค้าในร้าน']],
['ข้อมูลทางบัญชีช่วยวัดสิ่งใดของกิจการ','ฐานะ…1854 tokens truncated…TEMPTS_SHEET: 'คำตอบชั่วคราว',
  ROSTER_SHEET: 'ทะเบียนนักเรียน',
  EXAM_MINUTES: 40,
  QUESTION_COUNT: 40,
  TEACHER_SESSION_SECONDS: 21600,
  INITIAL_TEACHER_PIN: 'CHANGE-ME-2569'
});

const RESULT_HEADERS = ['วันเวลาส่ง','เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','ชุดข้อสอบ','คะแนน','คะแนนเต็ม','ร้อยละ','เวลาที่ใช้ (วินาที)','ส่งอัตโนมัติ','Attempt Token'];
const ATTEMPT_HEADERS = ['Attempt Token','เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','ชุดข้อสอบ','เวลาเริ่ม','กำหนดส่ง','คำตอบ JSON','สถานะ','เวลาส่ง','บันทึกล่าสุด','เวลาที่ใช้ (วินาที)'];
const ROSTER_HEADERS = ['เลขประจำตัว','ชื่อ–นามสกุล','เลขที่','ห้อง','สถานะ'];

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Accounting Fundamentals Online Examination System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
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
  const attempts = ensureSheet_(ss, CONFIG.ATTEMPTS_SHEET, ATTEMPT_HEADERS);
  const roster = ensureSheet_(ss, CONFIG.ROSTER_SHEET, ROSTER_HEADERS);
  attempts.hideSheet();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('TEACHER_PIN_HASH')) setTeacherPin_(CONFIG.INITIAL_TEACHER_PIN);
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

    const token = Utilities.getUuid();
    const setNumber = 1 + (positiveHash_(student.studentId + ':' + token) % 5);
    const startedAt = new Date();
    const deadline = new Date(startedAt.getTime() + CONFIG.EXAM_MINUTES * 60000);
    ctx.attempts.appendRow([
      token, student.studentId, student.fullName, student.number, student.room, setNumber,
      startedAt, deadline, '{}', 'กำลังสอบ', '', startedAt, 0
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

function submitExam(token, answers, autoSubmitted) {
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
    const row = [
      submittedAt, attempt.studentId, attempt.fullName, attempt.number, attempt.room,
      attempt.setNumber, score, CONFIG.QUESTION_COUNT, percent, duration,
      autoSubmitted === true ? 'ใช่' : 'ไม่ใช่', token
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
      autoSubmitted: autoSubmitted === true
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
    summary: { shown: rows.length, total: allCount, average: avg, autoSubmitted: autoCount },
    syncedAt: new Date().toISOString()
  };
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
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ROSTER_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ROSTER_HEADERS.length).getDisplayValues();
  const id = String(studentId);
  const row = rows.find(values => clean_(values[0], 20) === id);
  if (!row) return null;
  const student = {
    studentId: clean_(row[0], 20),
    fullName: clean_(row[1], 120),
    number: clean_(row[2], 4),
    room: clean_(row[3], 20)
  };
  if (student.fullName.length < 4 || !/^[0-9]{1,3}$/.test(student.number)) return null;
  if (['ม.4/3','ม.4/4'].indexOf(student.room) === -1) return null;
  if (row[4] && ['กำลังศึกษาอยู่','นักเรียนเข้าใหม่','active'].indexOf(clean_(row[4], 40).toLowerCase()) === -1) return null;
  return student;
}

function getContext_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return {
    ss: ss,
    results: ensureSheet_(ss, CONFIG.RESULTS_SHEET, RESULT_HEADERS),
    attempts: ensureSheet_(ss, CONFIG.ATTEMPTS_SHEET, ATTEMPT_HEADERS)
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
    status: String(v[9] || ''), submittedAt: v[10] ? new Date(v[10]) : null
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
    autoSubmitted: String(v[10]) === 'ใช่', token: String(v[11])
  };
}

function resultResponse_(row) {
  return {
    studentId: row.studentId, fullName: row.fullName, number: row.number, room: row.room,
    setNumber: row.setNumber, score: row.score, total: row.total, percent: row.percent,
    durationSeconds: row.durationSeconds, submittedAt: row.submittedAt,
    autoSubmitted: row.autoSubmitted
  };
}

function setTeacherPin_(pin) {
  if (!pin || String(pin).length < 8) throw new Error('รหัสครูต้องมีอย่างน้อย 8 ตัวอักษร');
  PropertiesService.getScriptProperties().setProperty('TEACHER_PIN_HASH', hashPin_(String(pin)));
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

