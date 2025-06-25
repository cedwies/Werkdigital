// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. App initialisieren
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Routes importieren und einbinden
const authRouter = require('./routes/auth');
const checkinRouter = require('./routes/checkin');

app.use('/auth', authRouter);
app.use('/checkin', checkinRouter);

// 4. DB-Verbindung
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('🔗 Mit MongoDB verbunden'))
    .catch(err => console.error('❌ MongoDB-Verbindungsfehler:', err));

// 5. Basis-Route
app.get('/', (req, res) => {
    res.send('HomeOffice-CheckIn API läuft');
});

// 6. Exportieren oder starten
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server läuft auf Port ${PORT}`);
    });
} else {
    module.exports = app;
}
