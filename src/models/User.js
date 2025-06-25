const mongoose = require('mongoose');

// Minimalistisches User-Modell
const UserSchema = new mongoose.Schema({
  // Nutzername – muss eindeutig sein, sonst gibts Ärger beim Login
  username: { type: String, required: true, unique: true },

  // Passwort wird nie im Klartext gespeichert → nur der Hash
  passwordHash: { type: String, required: true }
});

// Export, damit man überall im Projekt mit "User" arbeiten kann
module.exports = mongoose.model('User', UserSchema);
