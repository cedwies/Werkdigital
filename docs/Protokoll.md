# Protokoll – HomeOffice CheckIn App

## Entwicklungsumgebung
- Node.js (v20.18.3) und npm (v10.8.2) installiert

## Projektstart
- Projekt initialisiert mit `npm init -y`
- Benötigte Pakete installiert:
  express, mongoose, dotenv, jsonwebtoken, bcrypt, nodemailer, cors, nodemon

## Server eingerichtet
- `src/app.js` angelegt
- Express-Server erstellt, JSON-Parsing und CORS aktiviert
- MongoDB mit mongoose angebunden
- `.env` erstellt und eingebunden
- Serverstart über `npm run dev` funktioniert

## Datenmodelle
- Zwei Modelle erstellt:
  - `User` mit Username und Passwort-Hash
  - `CheckIn` mit Startzeit, Endzeit, Dauer, Datum und Email-Flag

## Authentifizierung
- JWT-Login umgesetzt:
  - `POST /auth/register` zum Benutzer anlegen
  - `POST /auth/login` gibt Token zurück
- Middleware prüft Token bei geschützten Routen
- Login mit curl getestet → funktioniert

## CheckIn-Funktion
- Routen für Start, Stop und Übersicht (`/checkin?date=...`) angelegt
- Funktioniert mit curl wie erwartet
- Dauer wird automatisch berechnet

## Email-Benachrichtigung
- Stop-Route sendet E-Mail an HR-Adresse aus `.env`
- E-Mail enthält Name, Startzeit, Endzeit, Dauer
- Test mit SMTP-Zugang von web.de erfolgreich

## Frontend (React)
- React App erstellt mit `create-react-app`
- Komponenten: `LoginForm`, `Dashboard`, `Overview`
- Navigation mit React Router
- JWT wird im localStorage gespeichert
- Login funktioniert, Start/Stop-Buttons aktiv
- Übersicht zeigt Einträge nach Datum

## Design & UX
- Oberflächen mit einfachem CSS-in-JS gestylt
- Buttons nebeneinander, Layout zentriert
- Lokale Zeit statt UTC dargestellt
- Übersicht und Navigation verbessert

## Ergebnis
- Alle Anforderungen der Aufgabe umgesetzt
- App läuft stabil, alle Funktionen getestet
