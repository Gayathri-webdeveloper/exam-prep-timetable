const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  date: String,
  dayNumber: Number,
  subject: String,
  tasks: [String],
  studyHours: Number,
  tips: [String],
  breakSchedule: String,
});

const timetableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    startDate: Date,
    schedule: [dayPlanSchema],
    generalSuggestions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);