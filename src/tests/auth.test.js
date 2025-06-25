const request = require('supertest');
const app = require('../app'); // App-Instanz importieren
const mongoose = require('mongoose');

describe('Auth API', () => {
    let server;

    // Server vor Tests starten (eigener Port, stört nix)
    beforeAll(() => {
        server = app.listen(4000);
    });

    // Nach allen Tests sauber aufräumen
    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    test('User kann sich registrieren', async () => {
        // Nutzername dynamisch – damit der Test nicht an Duplikaten scheitert
        const res = await request(server)
            .post('/auth/register')
            .send({ username: 'user' + Date.now(), password: 'testpass' });

        // Backend gibt 201 zurück bei erfolgreichem Anlegen
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    test('Login liefert Token', async () => {
        // Testuser muss vorher schon mal registriert worden sein
        const res = await request(server)
            .post('/auth/login')
            .send({ username: 'testuser1', password: 'testpass' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token'); // Wichtig für alle geschützten Routen
    });
});
