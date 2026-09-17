/** @OnlyCurrentDoc */

const SHEET_NAME = 'Sheet1';
const HEADERS = [
  'Submitted At',
  'Full Name',
  'Mobile Number',
  'Email',
  'City',
  'Preferred Language',
  'Program Interest',
  'Learning Background',
  'Consent',
  'Source',
  'Status',
  'Submission ID'
];

function doGet() {
  return response_('ready');
}

function doPost(event) {
  try {
    const values = event && event.parameter ? event.parameter : {};
    if (values.website) return response_('ok');

    const fullName = clean_(values.fullName, 100);
    const mobile = clean_(values.mobile, 30);
    const email = clean_(values.email, 150);
    const city = clean_(values.city, 100);
    const language = clean_(values.language, 30);
    const program = clean_(values.program, 100);
    const background = clean_(values.background, 500);
    const consent = values.consent === 'yes' ? 'Yes' : 'No';
    const submissionId = clean_(values.submissionId, 64);

    if (!fullName || !mobile || !city || !language || !program || consent !== 'Yes') {
      return response_('invalid');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('Registration sheet not found');
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

      if (submissionId && sheet.getLastRow() > 1) {
        const lastRow = sheet.getLastRow();
        const firstRow = Math.max(2, lastRow - 249);
        const rowCount = lastRow - firstRow + 1;
        const recentIds = sheet.getRange(firstRow, 12, rowCount, 1).getDisplayValues().flat();
        if (recentIds.includes(submissionId)) return response_('duplicate');
      }

      sheet.appendRow([
        new Date(),
        fullName,
        mobile,
        email,
        city,
        language,
        program,
        background,
        consent,
        'Website',
        'New',
        submissionId
      ]);
    } finally {
      lock.releaseLock();
    }

    return response_('ok');
  } catch (error) {
    console.error(error);
    return response_('error');
  }
}

function clean_(value, maxLength) {
  let text = String(value || '').trim();
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text.slice(0, maxLength);
}

function response_(status) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
