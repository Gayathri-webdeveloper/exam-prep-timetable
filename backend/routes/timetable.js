const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Exam = require('../models/Exam');
const Timetable = require('../models/Timetable');
const { generateSchedule } = require('../utils/generateSchedule');

// POST /api/timetable — Create timetable
router.post('/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('exams').isArray({ min: 1 }).withMessage('At least one exam needed'),
    body('exams.*.subject').notEmpty().withMessage('Subject required'),
    body('exams.*.examDate').isISO8601().withMessage('Valid date required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, exams, startDate } = req.body;

      // Save exams one by one
      const savedExams = [];
      for (const examData of exams) {
        const exam = new Exam({
          subject: examData.subject,
          examDate: new Date(examData.examDate),
          difficulty: examData.difficulty || 'medium',
          topics: Array.isArray(examData.topics) ? examData.topics : [],
          hoursPerDay: Number(examData.hoursPerDay) || 4,
        });
        const saved = await exam.save();
        savedExams.push(saved);
      }

      // Generate schedule
      const { schedule, generalSuggestions } = generateSchedule(
        savedExams,
        startDate ? new Date(startDate) : new Date()
      );

      // Save timetable
      const timetable = new Timetable({
        title: title || 'My Exam Prep Timetable',
        exams: savedExams.map((e) => e._id),
        startDate: startDate ? new Date(startDate) : new Date(),
        schedule,
        generalSuggestions,
      });

      const saved = await timetable.save();
      const result = await Timetable.findById(saved._id).populate('exams').lean();

      return res.status(201).json(result);
    } catch (err) {
      console.error('POST /timetable error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/timetable — Get all timetables
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate('exams')
      .sort({ createdAt: -1 })
      .lean();
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/timetable/:id — Get one timetable
router.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('exams')
      .lean();
    if (!timetable) return res.status(404).json({ error: 'Not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/timetable/:id — Delete timetable
router.delete('/:id', async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;