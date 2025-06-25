const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const CheckIn = require('../models/CheckIn');
const transporter = require('../email');
const User = require('../models/User');

// Alles hinter diesem Punkt ist nur für eingeloggte User erlaubt
router.use(authenticateToken);

// HomeOffice starten
router.post('/start', async (req, res) => {
  try {
    // Gucken ob schon ein CheckIn ohne Endzeit existiert → also ob noch „offen“
    const open = await CheckIn.findOne({ user: req.user.id, endTime: null });
    if (open) return res.status(400).json({ error: 'HomeOffice bereits gestartet' });

    // Startzeit festhalten & ISO-Datum extrahieren
    const startTime = new Date();
    const date = startTime.toISOString().split('T')[0];

    // Neuen CheckIn anlegen
    const checkin = new CheckIn({ user: req.user.id, startTime, date });
    await checkin.save();

    // Geben explizit alle Felder zurück, auch wenn z.B. endTime noch null ist
    res.status(201).json({
      _id: checkin._id,
      user: checkin.user,
      startTime: checkin.startTime,
      date: checkin.date,
      endTime: null,
      duration: checkin.duration,
      emailed: checkin.emailed
    });

  } catch (err) {
    // Falls z.B. DB nicht erreichbar ist
    res.status(500).json({ error: err.message });
  }
});

// HomeOffice stoppen
router.post('/stop', async (req, res) => {
  try {
    // Den offenen CheckIn holen (also der ohne endTime)
    const checkin = await CheckIn.findOne({ user: req.user.id, endTime: null });
    if (!checkin) return res.status(400).json({ error: 'Kein offener HomeOffice-Start gefunden' });

    // Ende setzen & Dauer berechnen (in Minuten)
    const endTime = new Date();
    const duration = Math.round((endTime - checkin.startTime) / 60000); // Differenz in Minuten
    checkin.endTime = endTime;
    checkin.duration = duration;
    await checkin.save();

    // Benutzerinfo holen für die E-Mail
    const user = await User.findById(req.user.id);

    // Zeiten hübsch für die E-Mail aufbereiten (deutsche Formatierung)
    const startLoc = new Date(checkin.startTime)
      .toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
    const endLoc = new Date(checkin.endTime)
      .toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });

    // E-Mail vorbereiten mit Text & HTML
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.HR_EMAIL,
      subject: `HomeOffice-Stopp: ${user.username} am ${checkin.date}`,
      text: `Mitarbeiter ${user.username} hat HomeOffice beendet.\n`
        + `Startzeit: ${startLoc}\n`
        + `Endzeit:   ${endLoc}\n`
        + `Dauer:     ${duration} Minuten\n`,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.5; color:#333;">
          <h2 style="color:#2a7ae2;">HomeOffice beendet</h2>
          <p>Folgender User hat das HomeOffice beendet:</p>
          <p><strong>${user.username}</strong></p>
          <table style="border-collapse:collapse; width:100%; max-width:400px;">
            <tr>
              <td style="padding:4px 8px; border:1px solid #ccc;"><strong>Startzeit</strong></td>
              <td style="padding:4px 8px; border:1px solid #ccc;">${startLoc}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:4px 8px; border:1px solid #ccc;"><strong>Endzeit</strong></td>
              <td style="padding:4px 8px; border:1px solid #ccc;">${endLoc}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px; border:1px solid #ccc;"><strong>Dauer</strong></td>
              <td style="padding:4px 8px; border:1px solid #ccc;">${duration} Minuten</td>
            </tr>
          </table>
          <p style="margin-top:16px; font-size:0.9em; color:#666;">
            Diese E-Mail wurde automatisch generiert.
          </p>
        </div>
      `
    };

    try {
      // Mail rausschicken
      const info = await transporter.sendMail(mailOptions);
      console.log('✔️  Mail gesendet:', info.response);

      // Markieren, dass Mail raus ist
      checkin.emailed = true;
      await checkin.save();
    } catch (err) {
      console.error('❌ Mailversand fehlgeschlagen:', err);
    }

    // CheckIn mit allen Infos zurückgeben
    res.json(checkin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Übersicht für ein bestimmtes Datum
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    // Kein Datum → kein Zugriff
    if (!date) return res.status(400).json({ error: 'Query-Parameter date fehlt' });

    // Alle CheckIns für das Datum + eingeloggten User holen
    const list = await CheckIn.find({ user: req.user.id, date });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
