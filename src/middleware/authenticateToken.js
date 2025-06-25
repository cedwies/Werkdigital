// src/middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

// Middleware, um geschützte Routen abzusichern
module.exports = (req, res, next) => {
    // Token kommt im Header → "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Nur den Token extrahieren

    // Kein Token = kein Zutritt
    if (!token) return res.status(401).json({ error: 'Token fehlt' });

    // Token prüfen (gegen unser geheimes JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token ungültig' });

        // Token ist ok → User-Daten hängen wir an req dran
        req.user = user; // enthält id und username
        next(); // weiter zur nächsten Middleware / Route
    });
};
