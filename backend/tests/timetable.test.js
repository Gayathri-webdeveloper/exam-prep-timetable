const request = require('supertest');
const mongoose = require('mongoose');
const http = require('http');
const app = require('../server');

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
}, 30000);

afterAll(async () => {
  await mongoose.connection.collection('timetables').drop().catch(() => {});
  await mongoose.connection.collection('exams').drop().catch(() => {});
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
}, 30000);

describe('Timetable API', () => {

  it('GET /api/health should return OK', async () => {
    const res = await request(server).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.database).toBe('connected');
  });

  it('POST /api/timetable should reject empty exams', async () => {
    const res = await request(server)
      .post('/api/timetable')
      .send({ title: 'Test', exams: [] });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/timetable should reject missing title', async () => {
    const res = await request(server)
      .post('/api/timetable')
      .send({
        exams: [{
          subject: 'Math',
          examDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        }],
      });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/timetable should create a timetable', async () => {
    const futureDate = new Date(Date.now() + 7 * 86400000).toISOString();
    const res = await request(server)
      .post('/api/timetable')
      .send({
        title: 'Test Timetable',
        startDate: new Date().toISOString(),
        exams: [
          {
            subject: 'Mathematics',
            examDate: futureDate,
            difficulty: 'medium',
            topics: ['Algebra', 'Calculus'],
            hoursPerDay: 4,
          },
        ],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Timetable');
    expect(Array.isArray(res.body.schedule)).toBe(true);
    expect(res.body.schedule.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.generalSuggestions)).toBe(true);
    expect(res.body.generalSuggestions.length).toBeGreaterThan(0);
  }, 60000);

  it('GET /api/timetable should return an array', async () => {
    const res = await request(server).get('/api/timetable');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/timetable/:id should return 404 for invalid id', async () => {
    const res = await request(server)
      .get('/api/timetable/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

});