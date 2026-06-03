const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  examDate: { type: Date, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  topics: [String],
  hoursPerDay: { type: Number, default: 4 },
});

module.exports = mongoose.model('Exam', examSchema);