// src/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ➤ Registrierung (nur für Testzwecke – im Livebetrieb besser deaktivieren)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;

    // Passwort hashen (nie Klartext speichern!)
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
        // Neuen User anlegen
        const user = new User({ username, passwordHash });
        await user.save();
        res.status(201).json({ message: 'User erstellt' });
    } catch (err) {
        // Falls z.B. Username schon vergeben ist
        res.status(400).json({ error: 'Username existiert schon' });
    }
});

// ➤ Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // User mit passendem Namen suchen
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Ungültige Credentials' });

    // Passwort vergleichen (hashed)
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Ungültige Credentials' });

    // Token generieren (läuft nach 8 Stunden ab)
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    // Token zurückschicken – wird im Frontend gespeichert
    res.json({ token });
});

module.exports = router;
