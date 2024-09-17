import mongoose from 'mongoose';
import Config from '../../config/config';
import User from '../../models/User';
import request from 'supertest';
import app from '../../app';

describe('POST /register', () => {
  beforeAll(async () => {
    await mongoose.connect(Config.DB_URI!);
  });

  beforeEach(async () => {
    await User.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('All Fields given', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(200);
      expect((response.body as Record<string, string>).password).not.toBe(
        userData.password,
      );
    });
  });
});
