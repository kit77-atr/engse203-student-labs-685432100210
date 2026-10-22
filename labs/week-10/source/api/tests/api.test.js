
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;

before(async () => {
  await loadSeed();
  app = createApp();
});

describe('GET /api/requests', () => {
  test('คืน array พร้อม 200', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
  });

  test('คืน requesterName แทน requester_id', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok('requesterName' in res.body[0]);
    assert.ok(!('requester_id' in res.body[0]));
  });

  test('กรอง status และไม่เปิดช่อง SQL Injection', async () => {
    const normal = await request(app)
      .get('/api/requests')
      .query({ status: 'pending' });

    assert.equal(normal.status, 200);
    assert.ok(normal.body.every((item) => item.status === 'pending'));

    const injection = await request(app)
      .get('/api/requests')
      .query({ status: "pending' OR '1'='1" });

    assert.equal(injection.status, 200);
    assert.deepEqual(injection.body, []);
  });
});

describe('GET /api/requests/:id', () => {
  test('พบคำร้องตอบ 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
    assert.ok(res.body.requesterName);
  });

  test('ไม่พบคำร้องตอบ 404', async () => {
    const res = await request(app).get('/api/requests/REQ-NOT-FOUND');

    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

describe('POST /api/requests', () => {
  test('สร้างคำร้องสำเร็จตอบ 201', async () => {
    const payload = {
      requesterName: 'ผู้ทดสอบ Week10',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องทดสอบ',
      details: 'ทดสอบสร้างคำร้อง',
      priority: 'normal',
    };

    const res = await request(app)
      .post('/api/requests')
      .send(payload);

    assert.equal(res.status, 201);
    assert.ok(res.body.id);
    assert.equal(res.body.requesterName, payload.requesterName);
    assert.equal(res.body.requestType, payload.requestType);
  });

  test('ข้อมูลไม่ครบตอบ 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ requesterName: 'ผู้ทดสอบ' });

    assert.equal(res.status, 400);
  });
});

describe('PUT /api/requests/:id', () => {
  test('แก้สถานะคำร้องสำเร็จ', async () => {
    const res = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'completed');
  });

  test('สถานะไม่ถูกต้องตอบ 400', async () => {
    const res = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'unknown' });

    assert.equal(res.status, 400);
  });

  test('แก้คำร้องที่ไม่มีอยู่ตอบ 404', async () => {
    const res = await request(app)
      .put('/api/requests/REQ-NOT-FOUND')
      .send({ status: 'completed' });

    assert.equal(res.status, 404);
  });
});

describe('DELETE /api/requests/:id', () => {
  test('ลบคำร้องที่มีอยู่ตอบ 204', async () => {
    const created = await request(app)
      .post('/api/requests')
      .send({
        requesterName: 'ผู้ทดสอบลบ',
        requestType: 'อื่น ๆ',
        location: 'ห้องทดสอบ',
        details: 'ทดสอบลบคำร้อง',
        priority: 'normal',
      });

    assert.equal(created.status, 201);

    const deleted = await request(app)
      .delete(`/api/requests/${created.body.id}`);

    assert.equal(deleted.status, 204);

    const fetched = await request(app)
      .get(`/api/requests/${created.body.id}`);

    assert.equal(fetched.status, 404);
  });

  test('ลบคำร้องที่ไม่มีอยู่ตอบ 404', async () => {
    const res = await request(app)
      .delete('/api/requests/REQ-NOT-FOUND');

    assert.equal(res.status, 404);
  });
});
