import request from 'supertest';
import app from '../src/index'; // Assuming app.ts initializes Express

// describe('User Controller', () => {
//   it('POST /users should return a list of users', async () => {
//     const response = await request(app).post('/users');
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });


describe('POST /login', () => {
    it('should return 404 if user does not exist', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'password'
            });
        expect(response.statusCode).toBe(404);
    });
});