import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/**
 * Week 13 — เข้าสู่ระบบและสิทธิ์
 * test 3 ข้อแรกให้มาแล้ว — จะ fail จนกว่าจะทำ CP50–CP51 เสร็จ (เขียน test ก่อน แล้วทำให้ผ่าน)
 */
const app = createApp();
beforeEach(async () => { await loadSeed(); });

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });

  // 🏫 TODO W13-LOGIN (CP50): อีเมลที่ไม่มี ต้องได้ข้อความ error เดียวกับรหัสผ่านผิด
  test('อีเมลที่ไม่มี → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, email: 'nonexistent@example.com' });
    expect(r.status).toBe(401);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });

  // 🏫 TODO W13-AUTH (CP51): เพิ่ม
  //   - token ที่ไม่ใช่เจ้าหน้าที่ → 403      ใช้ tokenFor('requester')
  //   - token ปลอม (secret อื่น) → 401        ใช้ tokenFor('staff', 'not-the-real-secret')
  //   - เจ้าหน้าที่ → PUT 200 และ DELETE 204  ใช้ await loginAsStaff(app)
  //   ⚠ หลังผูก authenticate แล้ว test ของ PUT/DELETE ใน requests.api.test.js จะพัง (401)
  //     — นั่นคือสัญญาณว่า requirement เปลี่ยน: แก้ test ให้เข้าสู่ระบบก่อน

  test('token ที่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const token = tokenFor('requester');

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(403);
  });

  test('token ปลอม → 401', async () => {
    const token = tokenFor('staff', 'not-the-real-secret');

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  test('เจ้าหน้าที่สามารถ PUT 200 และ DELETE 204', async () => {
    const token = await loginAsStaff(app);

    const updated = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(updated.status).toBe(200);

    const deleted = await request(app)
      .delete('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`);

    expect(deleted.status).toBe(204);
  });
});
