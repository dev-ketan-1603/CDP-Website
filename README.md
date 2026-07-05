# Cyber Security Awareness Workshop

A single-page, interactive front-end for a **Community Development Project (CDP)** cyber security awareness workshop. Visitors learn to spot common online threats, test password strength, complete an external training portal, and submit their completion certificate — all without needing to create an account.

**Live demo:** _add your hosted link here_

---

## Features

- **Threat ticker & scam labs** — an interactive phishing-email simulator (click the red flags) and a live password-entropy/strength tester
- **Threat library** — a filterable grid of common scams (phishing, QR code scams, deepfakes, public WiFi risks, cyberbullying, etc.)
- **Action center** — quick links to the external training portal, the scam labs, and the presentation deck
- **Certificate submission** — a themed modal form where students upload their completed certificate (PDF) along with their details; submissions are logged and files stored with **no login required**
- **Dark / light theme toggle**
- **Responsive design**, built mobile-first with a distinct neo-brutalist visual style (hard shadows, high-contrast palette, monospace accents)

---

## Tech Stack

- Plain **HTML / CSS / JavaScript** — no framework, no build step
- [AOS](https://michalsnik.github.io/aos/) for scroll animations
- [Vanilla-Tilt.js](https://micku7zu.github.io/vanilla-tilt.js/) for card tilt effects
- [Typed.js](https://github.com/mattboldt/typed.js/) for the hero typing effect
- [Font Awesome](https://fontawesome.com/) for icons
- **Google Apps Script** as a free, serverless backend (Google Sheets + Google Drive) for certificate submissions

---

## Project Structure

```
.
├── index.html                      # Markup for all sections + certificate modal
├── styles.css                      # All styling, theme tokens, responsive rules
├── script.js                       # UI interactions + certificate submission logic
└── apps-script-upload-addition.gs  # Backend script (paste into Google Apps Script)
```

---

## Getting Started

1. Clone or download this repository.
2. Open `index.html` directly in a browser — no server or build step needed for the front-end alone.
3. To enable certificate submissions (form upload → Google Sheet + Drive), follow the backend setup below.

---

## Certificate Submission Backend Setup

Submissions are handled by a Google Apps Script web app, so there's no server to host and no login required for visitors.

> ⚠️ Use a Google account dedicated to this project (with a recovery phone/email added) rather than a personal or throwaway account — new/unverified accounts can hit Drive permission errors, and a suspended account would take the whole system down with it.

### 1. Create a Google Sheet
Create a spreadsheet with a header row: `Timestamp | Name | Class | Section | Mobile | Reference | Certificate Link`

### 2. Create a Google Drive folder
Create a folder to store uploaded certificates, and copy its **Folder ID** from the URL (`.../folders/<FOLDER_ID>`).

### 3. Add the backend script
In the Sheet, go to **Extensions → Apps Script**, paste in the contents of `apps-script-upload-addition.gs`, and set:
```javascript
const CERTIFICATE_FOLDER_ID = "your-folder-id-here";
```
Make sure the sheet name referenced in the script (`getSheetByName("Sheet1")`) matches your actual tab name.

### 4. Deploy
**Deploy → New deployment → Web app**, with:
- **Execute as:** Me
- **Who has access:** Anyone

Copy the resulting web app URL.

### 5. Connect the front-end
In `script.js`, set:
```javascript
const SCRIPT_URL = "your-deployed-web-app-url-here";
```

### 6. Test
Submit the form with a sample PDF and confirm a new row appears in the Sheet with a working Drive link.

---

## Customization

Theme colors, fonts, and shadows are controlled via CSS variables at the top of `styles.css`:

```css
:root{
  --volt: #D4FF00;   /* accent 1 */
  --riot: #FF4D6D;   /* accent 2 */
  --signal: #4361FF; /* accent 3 */
  ...
}
```
Swap these to re-theme the entire site consistently.

---

## Known Limitations

- Duplicate-submission prevention uses `localStorage`, which a visitor can clear — it's a UX nicety, not a security control.
- No CAPTCHA/rate-limiting is in place yet; add one if the form is exposed to spam.
- Max upload size is capped client-side (and should be mirrored server-side) at 5MB to stay well under Apps Script's request size limits.

---

## Author

**Ketan Yadav** — B.Tech CSE (AI/ML), Workshop Conductor

---

## License

_Add a license (e.g. MIT) here if you intend to open-source this._
