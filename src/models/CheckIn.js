const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');

describe('CheckIn API', () => {
  let server;
  let token;

  beforeAll(async () => {
    server = app.listen(4001); // Testserver auf separatem Port

    // Aufräumen – vorherige Nutzer & CheckIns löschen
    await User.deleteMany({});
    await CheckIn.deleteMany({});

    // Frischen User registrieren
    await request(server).post('/auth/register').send({
      username: 'checkinuser',
      password: 'checkpass',
    });

    // Und direkt einloggen, um JWT zu bekommen
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ username: 'checkinuser', password: 'checkpass' });

    token = loginRes.body.token; // Token für alle Folge-Requests speichern
  });

  afterAll(async () => {
    await mongoose.disconnect(); // DB-Verbindung schließen
    server.close();              // Server stoppen
  });

  test('Startet einen neuen CheckIn', async () => {
    const res = await request(server)
      .post('/checkin/start')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201); // neu = created
    expect(res.body).toHaveProperty('startTime');
    expect(res.body).toHaveProperty('date');
    expect(res.body.endTime).toBeNull(); // sollte noch offen sein
  });

  test('Beendet den CheckIn', async () => {
    const res = await request(server)
      .post('/checkin/stop')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // OK
    expect(res.body).toHaveProperty('endTime');
    expect(res.body).toHaveProperty('duration');
    expect(res.body.duration).toBeGreaterThanOrEqual(0); // Dauer darf nicht negativ sein
  });

  test('Gibt CheckIns für ein Datum zurück', async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const res = await request(server)
      .get(`/checkin?date=${today}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // muss ein Array sein
    expect(res.body.length).toBeGreaterThan(0); // wir haben eben einen CheckIn gemacht
  });
});
