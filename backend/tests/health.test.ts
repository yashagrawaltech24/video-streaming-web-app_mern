// tests/health.test.ts

import { test, expect } from 'bun:test';
import app from '../src/app';
import request from 'supertest';

test('GET /api/health should return 200', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.message).toBe('Healthy 🚀');
});
