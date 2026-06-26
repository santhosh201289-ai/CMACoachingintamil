# Enquiry form → Google Sheets setup

The Contact section's enquiry form posts directly into a **Google Sheet** using a
**Google Apps Script Web App** (no server needed). Minimal mandatory fields:
**Name**, **Phone / WhatsApp**, **Interested In**.

You connect it once by pasting your Web App URL into the form.

## 1. Create the Google Sheet
1. Create a new Google Sheet (e.g. "Thulumbu Enquiries").
2. In row 1, add headers: `Timestamp` | `Name` | `Phone` | `Interested In` | `Email`.

## 2. Add the Apps Script
1. In the Sheet: **Extensions → Apps Script**.
2. Delete any sample code and paste this:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.phone || '',
      p.interest || '',
      p.email || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. **Save** (disk icon).

## 3. Deploy as a Web App
1. **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. **Execute as:** Me. **Who has access:** **Anyone**.
4. **Deploy** → authorize (allow access to your account).
5. Copy the **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfyc.../exec`.

## 4. Connect the website
In `src/index.html`, find the enquiry form and replace the placeholder:

```html
<form class="enquiry-form" action="GOOGLE_SHEET_WEBAPP_URL" method="post">
```

with your URL:

```html
<form class="enquiry-form" action="https://script.google.com/macros/s/AKfyc.../exec" method="post">
```

## Done
Submitting the form now appends a row (Timestamp, Name, Phone, Interested In) to
your Sheet, and the visitor sees “Thank you! We'll call you back soon.”

### Notes
- The browser sends the request with `mode: 'no-cors'` (Apps Script doesn't return
  CORS headers), so the row is written even though the page can't read the
  response. Success is shown optimistically; only a network failure shows an error.
- To add fields later: add the `<input>`/`<select>` with a `name`, add a matching
  `sheet.appendRow` column, and a header in the Sheet.
- If you change the Apps Script, **redeploy** (Deploy → Manage deployments → edit →
  New version) or the URL keeps serving the old code.

---

## Optional: WhatsApp a copy of each enquiry (to +91 72998 17898)

WhatsApp has no free built-in API, so we use **CallMeBot** (free, for notifying
your own number) from the Apps Script.

### A. Activate CallMeBot (one time, from the +91 72998 17898 phone)
1. Save **+34 644 51 95 23** as a WhatsApp contact (name it "CallMeBot").
2. From WhatsApp on **+91 72998 17898**, send this message to that contact:
   `I allow callmebot to send me messages`
3. You'll get a reply: **"Your apikey is 123456"** — copy that number.

### B. Update the Apps Script
Replace your `doPost` code with this (paste your apikey in `CALLMEBOT_APIKEY`):

```javascript
var WHATSAPP_TO = '917299817898';          // number to notify (no +)
var CALLMEBOT_APIKEY = 'PASTE_YOUR_KEY';   // from CallMeBot activation

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = (e && e.parameter) || {};
    var name = p.name || '', phone = p.phone || '',
        interest = p.interest || '', email = p.email || '';

    sheet.appendRow([new Date(), name, phone, interest, email]);
    notifyWhatsApp(name, phone, interest, email);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function notifyWhatsApp(name, phone, interest, email) {
  if (!CALLMEBOT_APIKEY || CALLMEBOT_APIKEY === 'PASTE_YOUR_KEY') return;
  try {
    var msg = 'New CMA enquiry (Thulumbu)\n'
            + 'Name: ' + name + '\n'
            + 'Phone: ' + phone + '\n'
            + 'Email: ' + email + '\n'
            + 'Interested: ' + interest;
    var url = 'https://api.callmebot.com/whatsapp.php'
            + '?phone=' + WHATSAPP_TO
            + '&text=' + encodeURIComponent(msg)
            + '&apikey=' + CALLMEBOT_APIKEY;
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (err) {
    // never let a WhatsApp failure block the enquiry from saving
  }
}
```

### C. Redeploy
Save → **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**
(URL stays the same). Submit a test enquiry — the row saves **and** a WhatsApp
arrives on +91 72998 17898.

> CallMeBot is a free third-party service meant for personal notifications. It's
> great for low volume but can rate-limit/occasionally delay. For guaranteed
> business-grade delivery, use the **WhatsApp Cloud API (Meta)** or **Twilio** —
> ask and I'll provide that version.
```
