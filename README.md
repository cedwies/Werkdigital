# HomeOffice CheckIn App

---

## 🚀 Funktionen

- Benutzer-Login mit JWT-Authentifizierung
- HomeOffice-CheckIn (Start) und CheckOut (Stopp)
- Übersicht über Einträge eines Tages
- Automatischer E-Mail-Versand an HR
- Live-Timer im Dashboard für Arbeitnehmer

---

## 🛠️ Setup

### ✅ Voraussetzungen

- Node.js und npm installiert  
- MongoDB installiert und laufend (Standard-Port: `27017`)

Prüfen:

```bash
node -v
npm -v
mongod --version
```

> ℹ️ MongoDB starten (macOS über Brew):
>
> ```bash
> brew services start mongodb/brew/mongodb-community
> ```

---

### 1. Backend starten

```bash
cp .env.example .env
```

Dann `.env` befüllen:

```env
MONGODB_URI=mongodb://localhost:27017/homeoffice
JWT_SECRET=deinGeheimnis
HR_EMAIL=hr@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=example@example.com
SMTP_PASS=passwort123
```

Dann:

```bash
npm install
npm run dev
```

---

### 2. Frontend starten

```bash
cd frontend
npm install
npm start
```

Das Frontend läuft auf [`http://localhost:3001`](http://localhost:3001)  
(Achtung: In `package.json` ist ein Proxy definiert)

---

## ✅ Nutzung

1. Backend und Frontend starten
2. Nutzer registrieren (einmalig):

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'
```

3. Über das UI einloggen
4. Auf dem Dashboard: HomeOffice starten/beenden
5. In der Übersicht: vergangene CheckIns nach Datum einsehen

---

## 🧪 Tests

```bash
# Backend-Tests ausführen:
npx jest
```

---

## 📦 Projektstruktur

```
/frontend  → React-Client
/backend   → Express-Server (API, Auth, DB, Mail)
```

---

## 📧 E-Mail-Versand

Die App versendet beim Stoppen automatisch eine Mail an HR.  
Funktioniert über SMTP, z. B. mit Gmail oder Mailhog.

---

## 👨‍💻 Entwickler

Cedric Wiese  
Stand: 25. Juni 2025
