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
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('All Fields given', () => {
    it('should return 200 status code.', async () => {
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

    it('should return 400 status code if user exists.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
        password: 'password123',
      };

      await request(app).post('/api/v1/user/register').send(userData);

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Some Fields are missing.', () => {
    it('should return 400 if user body is not given.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
      };

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
    });
  });
});

describe('POST /login', () => {
  beforeAll(async () => {
    await mongoose.connect(Config.DB_URI!);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('All Fields given', () => {
    it('should return 200 status code.', async () => {
      const userData = {
        email: 'test1@example.com',
        name: 'test',
        password: 'password123',
      };

      await request(app).post('/api/v1/user/register').send(userData);

      const response = await request(app).post('/api/v1/user/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();

      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies[0];
      const refreshTokenCookie = cookies[1];

      expect(accessTokenCookie).toBeDefined();
      expect(accessTokenCookie).toMatch(/HttpOnly/);
      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toMatch(/HttpOnly/);

      const accessToken = accessTokenCookie.split(';')[0].split('=')[1];
      const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });
  });
});
