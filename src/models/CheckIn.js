const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  date: { type: String, required: true },
  emailed: { type: Boolean, default: false }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
