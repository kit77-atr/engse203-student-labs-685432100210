
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';

let db;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');

const SELECT_SHAPE = `
  SELECT r.id,
         u.name AS requesterName,
         r.request_type AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id
`;

export async function loadSeed() {
  mkdirSync(path.dirname(DB_FILE), { recursive: true });
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');

  const ready = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = 'requests'
  `).get();

  if (!ready) {
    if (!existsSync(SCHEMA_FILE)) {
      throw new Error(`ไม่พบ schema.sql: ${SCHEMA_FILE}`);
    }
    db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
  }
}

export function findAll({ status } = {}) {
  if (status) {
    return db.prepare(
      `${SELECT_SHAPE} WHERE r.status = ? ORDER BY r.id`
    ).all(status);
  }

  return db.prepare(`${SELECT_SHAPE} ORDER BY r.id`).all();
}

export function findById(id) {
  return db.prepare(
    `${SELECT_SHAPE} WHERE r.id = ?`
  ).get(id) ?? null;
}

export function create(input = {}) {
  const {
    requesterName,
    requestType,
    location,
    details,
    priority = 'normal',
    status = 'pending',
  } = input;

  if (
    typeof requesterName !== 'string' || !requesterName.trim() ||
    typeof requestType !== 'string' ||
    typeof location !== 'string' || !location.trim() ||
    typeof details !== 'string' || !details.trim()
  ) {
    throw new Error('ข้อมูลคำขอไม่ครบถ้วน');
  }

  const allowedTypes = [
    'แจ้งซ่อม',
    'บริการบัญชีผู้ใช้',
    'ขอใช้อุปกรณ์',
    'อื่น ๆ',
  ];

  if (!allowedTypes.includes(requestType)) {
    throw new Error('ประเภทคำขอไม่ถูกต้อง');
  }

  if (!['normal', 'urgent'].includes(priority)) {
    throw new Error('ระดับความสำคัญไม่ถูกต้อง');
  }

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw new Error('สถานะไม่ถูกต้อง');
  }

  let user = db.prepare(
    'SELECT id FROM users WHERE name = ?'
  ).get(requesterName.trim());

  if (!user) {
    const result = db.prepare(`
      INSERT INTO users (name, department, email)
      VALUES (?, ?, ?)
    `).run(
      requesterName.trim(),
      'ไม่ระบุ',
      `requester-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
    );

    user = { id: Number(result.lastInsertRowid) };
  }

  const existingIds = db.prepare(
    "SELECT id FROM requests WHERE id GLOB 'REQ-[0-9]*'"
  ).all();

  const maxId = existingIds.reduce((max, row) => {
    const match = /^REQ-(\d+)$/.exec(row.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  const id = `REQ-${String(maxId + 1).padStart(3, '0')}`;

  db.prepare(`
    INSERT INTO requests
      (id, requester_id, request_type, location, details, priority, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, user.id, requestType,
    location.trim(), details.trim(), priority, status
  );

  return findById(id);
}

export function updateStatus(id, status) {
  const result = db.prepare(
    'UPDATE requests SET status = ? WHERE id = ?'
  ).run(status, id);

  return result.changes ? findById(id) : null;
}

export function remove(id) {
  const result = db.prepare(
    'DELETE FROM requests WHERE id = ?'
  ).run(id);

  return result.changes > 0;
}
