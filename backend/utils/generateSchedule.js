function generateSchedule(exams, startDate) {
  const schedule = [];
  const suggestions = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate) - new Date(b.examDate)
  );

  const lastExamDate = new Date(sortedExams[sortedExams.length - 1].examDate);
  lastExamDate.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil((lastExamDate - start) / (1000 * 60 * 60 * 24));

  if (totalDays <= 0) {
    return {
      schedule: [],
      generalSuggestions: ['Exam date has already passed or is today!'],
    };
  }

  const difficultyWeight = { easy: 1, medium: 2, hard: 3 };
  const maxDays = Math.min(totalDays, 365);

  for (let i = 0; i < maxDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const dateStr = currentDate.toISOString().split('T')[0];
    const isWeekend =
      currentDate.getDay() === 0 || currentDate.getDay() === 6;

    const upcomingExams = sortedExams.filter((exam) => {
      const examDay = new Date(exam.examDate);
      examDay.setHours(0, 0, 0, 0);
      return examDay > currentDate;
    });

    if (upcomingExams.length === 0) break;

    const focusExam = upcomingExams.reduce((prev, curr) => {
      const prevDays = Math.ceil(
        (new Date(prev.examDate) - currentDate) / (1000 * 60 * 60 * 24)
      );
      const currDays = Math.ceil(
        (new Date(curr.examDate) - currentDate) / (1000 * 60 * 60 * 24)
      );
      const prevScore = prevDays / (difficultyWeight[prev.difficulty] || 2);
      const currScore = currDays / (difficultyWeight[curr.difficulty] || 2);
      return currScore < prevScore ? curr : prev;
    });

    const daysToFocusExam = Math.ceil(
      (new Date(focusExam.examDate) - currentDate) / (1000 * 60 * 60 * 24)
    );

    let studyHours = isWeekend
      ? Math.max(2, (focusExam.hoursPerDay || 4) - 1)
      : focusExam.hoursPerDay || 4;

    if (daysToFocusExam <= 2) studyHours = Math.min(8, studyHours + 2);
    if (daysToFocusExam === 1) studyHours = Math.min(6, studyHours);

    let todayTasks = [];
    const topicsCount = focusExam.topics?.length || 0;

    if (topicsCount > 0) {
      const topicsPerDay = Math.max(
        1,
        Math.ceil(topicsCount / Math.max(1, daysToFocusExam))
      );
      const topicIndex = (i * topicsPerDay) % topicsCount;
      todayTasks = focusExam.topics.slice(topicIndex, topicIndex + topicsPerDay);
    } else {
      todayTasks = getDefaultTasks(focusExam.subject, daysToFocusExam, i);
    }

    if (daysToFocusExam === 1) {
      todayTasks = [
        `Full revision of ${focusExam.subject}`,
        'Practice past papers',
        'Review all notes',
        'Rest well tonight',
      ];
    }

    const tips = getDailyTips(daysToFocusExam, isWeekend, studyHours, i);
    const breakSchedule = getBreakSchedule(studyHours);

    schedule.push({
      date: dateStr,
      dayNumber: i + 1,
      subject: focusExam.subject,
      tasks: todayTasks,
      studyHours,
      tips,
      breakSchedule,
    });
  }

  const hardExams = sortedExams.filter((e) => e.difficulty === 'hard');
  if (hardExams.length > 0) {
    suggestions.push(
      `Focus extra time on: ${hardExams.map((e) => e.subject).join(', ')} — marked as hard.`
    );
  }
  if (sortedExams.length > 3) {
    suggestions.push(
      'With multiple exams, avoid cramming. Consistent daily study beats last-minute revision.'
    );
  }
  suggestions.push('Use the Pomodoro technique: 25 min study, 5 min break.');
  suggestions.push('Review your notes every morning before starting new topics.');
  suggestions.push('Get at least 7-8 hours of sleep — memory consolidates during sleep.');
  suggestions.push('Stay hydrated and take short walks between study sessions.');
  suggestions.push('Teach concepts to yourself out loud — it reveals gaps in understanding.');

  return { schedule, generalSuggestions: suggestions };
}

function getDefaultTasks(subject, daysLeft, dayIndex) {
  const phases = [
    [
      `Introduction & overview of ${subject}`,
      'Read syllabus thoroughly',
      'Gather all study materials',
    ],
    [
      `Core concepts of ${subject}`,
      'Make chapter-wise notes',
      'Highlight key formulas/definitions',
    ],
    [
      `Mid-level topics in ${subject}`,
      'Solve practice questions',
      'Create mind maps',
    ],
    [
      `Advanced topics in ${subject}`,
      'Work on previous year papers',
      'Identify weak areas',
    ],
    [
      `Revision of all ${subject} topics`,
      'Take a mock test',
      'Review mistakes',
    ],
  ];
  if (daysLeft <= 1) {
    return [`Final revision of ${subject}`, 'Skim through all notes', 'Rest well'];
  }
  return phases[dayIndex % phases.length];
}

function getDailyTips(daysLeft, isWeekend, studyHours, dayIndex) {
  const tips = [];
  if (daysLeft > 7) tips.push('Build strong foundations today — no shortcuts.');
  if (daysLeft <= 7 && daysLeft > 3) tips.push('Shift focus to weak areas and practice problems.');
  if (daysLeft <= 3) tips.push('Prioritize revision over learning new material now.');
  if (daysLeft === 1) tips.push('Light revision only. Avoid stress. Sleep early.');
  if (isWeekend) tips.push('Weekend — lighter schedule, but stay consistent.');
  if (studyHours >= 6) tips.push('Heavy study day — take a 15-min walk after every 2 hours.');
  if (dayIndex % 7 === 6) tips.push('Weekly review day — go over everything from this week.');
  return tips;
}

function getBreakSchedule(studyHours) {
  if (studyHours <= 2) return '10-min break after each hour';
  if (studyHours <= 4) return '10-min break every hour, 30-min lunch break';
  if (studyHours <= 6) return 'Pomodoro: 25 min study / 5 min break, long break after 4 cycles';
  return 'Pomodoro cycles + 1-hour midday break + short walk every 90 min';
}

module.exports = { generateSchedule };