# SupplyNC — National Supply Chain Management System

A full-featured supply chain management system built in plain HTML, CSS and vanilla JavaScript. No build tools or frameworks required.

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser
Simply open `index.html` in any modern browser. All data is stored in `localStorage`.

### Option 2: VS Code Live Server (Recommended)
1. Open the project folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Visit `http://127.0.0.1:5500`

### Option 3: GitHub Pages
1. Push the entire project to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root `/`
4. Your site will be at `https://yourusername.github.io/supply-chain/`

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin (IT) | admin@supplync.org | Admin@2024 |
| District Manager | daniel.mwale@supplync.org | District@2024 |
| Province Manager | patricia.banda@supplync.org | Province@2024 |
| HQ Management | george.tembo@supplync.org | HQ@2024secure |
| Facility Staff | alice.phiri@supplync.org | Facility@2024 |

> 💡 Click **Use** buttons on the login page to auto-fill credentials.

---

## 🏗️ Project Structure

```
supply-chain/
│
├── index.html                   ← Login page
├── signup.html                  ← Registration (all roles)
│
├── dashboards/
│   ├── facility.html            ← Facility staff dashboard
│   ├── district.html            ← District manager dashboard
│   ├── province.html            ← Province manager dashboard
│   ├── hq.html                  ← HQ senior management dashboard
│   └── admin.html               ← System administrator dashboard
│
├── reports/
│   ├── submit.html              ← Submit monthly report (with validation)
│   ├── history.html             ← Report history, withdraw, delete
│   ├── review.html              ← Manager review, approve/reject
│   └── window-manager.html      ← Control report windows
│
├── requisitions/
│   ├── request.html             ← New requisitions + inbound requests
│   └── track.html               ← Full delivery tracking
│
├── stock/
│   ├── warehouse.html           ← Own warehouse management
│   └── facility-stock.html      ← View stock across facilities (managers)
│
├── commodities/
│   └── manage.html              ← Commodity catalogue (medical + non-medical)
│
├── users/
│   ├── manage.html              ← User management
│   └── signup-approvals.html    ← Admin: approve/reject signups
│
├── setup/
│   └── onboarding.html          ← Admin: provinces, districts, facilities
│
├── transporter/
│   └── confirm.html             ← Email-link landing page for transporters
│
└── assets/
    ├── css/
    │   └── style.css            ← Full design system
    └── js/
        ├── mock-data.js         ← Data store (localStorage)
        └── auth.js              ← Auth, RBAC, UI helpers
```

---

## 👥 Role Hierarchy

```
Admin (IT) — Full system access, preloaded account
    ↓
HQ Senior Management — National oversight
    ↓
Province Manager — Province-level management
    ↓
District Manager — District + facilities management
    ↓
Facility Staff — End users at facility level
         +
Transporter — External, assigned via email link
```

---

## ✨ Key Features

### 📋 Reporting
- Auto report window: **30th → 7th** every month
- Managers can reopen with a mandatory closing date
- Smart validation: closing balance = opening + received − consumed − given away − expired − damaged
- Consumed/given away cannot exceed stock on hand
- Full lifecycle: draft → preview → submit → approve/reject → withdraw/delete

### 📦 Stock Management
- Every level (Facility, District, Province, HQ) has its own warehouse
- Facility stock is **only populated by confirmed deliveries** — never manual entry
- Smart alerts: low stock, expiring (30 days), expired (locked)
- Full movement ledger per commodity

### 🚚 Requisitions & Delivery
- Request commodities at any level, in any direction
- Proactive dispatch by higher ranks
- 4-step confirmation: Sender → Transporter (email link) → Receiver → Manager sign-off
- Stock auto-updated on confirmed receipt

### 👤 User Management
- All users sign up; **Admin approves all accounts**
- Root Admin is preloaded — never needs signup
- Role-based access control throughout
- Province managers can view district and facility dashboards

---

## 🔧 Adding a Real Backend

When you're ready to connect a real server:

1. Replace `localStorage` calls in `assets/js/mock-data.js` with `fetch()` API calls
2. Add EmailJS or a mail server for real email notifications
3. Replace the transporter confirm page with a token-based URL system
4. Add proper password hashing (bcrypt) server-side

---

## 📧 Email Integration (EmailJS)

To enable real emails:
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create templates for: report submitted, approved/rejected, transporter assignment, delivery confirmed
3. Add your public key and template IDs in `assets/js/auth.js`
4. Uncomment the `emailjs.send()` calls in the notification hooks

---

## 🔄 Reset Demo Data

To reset all data back to the original demo state:
```javascript
// Open browser console and run:
localStorage.removeItem('sc_initialized');
location.reload();
```

---

## 📱 Browser Support

Chrome, Firefox, Edge, Safari — all modern browsers supported.
Mobile responsive via CSS breakpoints at 900px and 600px.

---

*Built with plain HTML, CSS & JavaScript — no dependencies, no build step.*