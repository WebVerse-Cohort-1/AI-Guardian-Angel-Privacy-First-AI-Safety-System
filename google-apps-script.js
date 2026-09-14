/**
 * Ultra-Fast Google Apps Script Backend for Direct Google Sheets Storage
 * 
 * Instructions:
 * 1. Open Google Sheet -> Extensions -> Apps Script
 * 2. Paste this code into Code.gs
 * 3. Click "Deploy" -> "New deployment"
 * 4. Select type: "Web app"
 * 5. Execute as: "Me"
 * 6. Who has access: "Anyone"
 * 7. Deploy and copy the Web App URL!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for lock to avoid row overwrite collisions
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData ? e.postData.contents : "{}";
    var data = {};
    
    try {
      data = JSON.parse(rawData);
    } catch (err) {
      data = e.parameter || {};
    }

    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = ["Timestamp"];
      for (var key in data) {
        if (key !== "timestamp") headers.push(key);
      }
      sheet.appendRow(headers);
    }

    // Build row data
    var row = [data.timestamp || new Date().toISOString()];
    for (var k in data) {
      if (k !== "timestamp") {
        row.push(typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]);
      }
    }

    // Append row directly
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Google Apps Script Web App Running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
