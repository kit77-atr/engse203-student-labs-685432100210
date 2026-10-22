
PRAGMA foreign_keys = ON;

-- ลบตารางลูกก่อนตารางแม่ เพื่อให้รันซ้ำได้
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

-- ตารางผู้ใช้
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- ตารางคำขอบริการ
CREATE TABLE requests (
  id TEXT PRIMARY KEY,
  requester_id INTEGER NOT NULL,
  request_type TEXT NOT NULL
    CHECK (request_type IN (
      'แจ้งซ่อม',
      'บริการบัญชีผู้ใช้',
      'ขอใช้อุปกรณ์',
      'อื่น ๆ'
    )),
  location TEXT NOT NULL,
  details TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('normal', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- ข้อมูลผู้ใช้ตั้งต้น
INSERT INTO users (name, department, email) VALUES
  ('สมชาย ใจดี', 'เทคโนโลยีสารสนเทศ', 'somchai@example.com'),
  ('สมหญิง รักเรียน', 'บริหารธุรกิจ', 'somying@example.com'),
  ('กิตติพงษ์ มีสุข', 'วิศวกรรมศาสตร์', 'kittipong@example.com'),
  ('นภัสสร แสงทอง', 'วิทยาศาสตร์', 'napatsorn@example.com');

-- ข้อมูลคำขอตั้งต้น
INSERT INTO requests
  (id, requester_id, request_type, location, details, priority, status)
VALUES
  ('REQ-001', 1, 'แจ้งซ่อม', 'อาคาร A ห้อง 101',
   'คอมพิวเตอร์เปิดไม่ติด', 'urgent', 'pending'),
  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'ห้องสำนักงาน',
   'ขอตั้งค่าบัญชีผู้ใช้ใหม่', 'normal', 'pending'),
  ('REQ-003', 3, 'ขอใช้อุปกรณ์', 'ห้องปฏิบัติการ',
   'ขอยืมโปรเจกเตอร์', 'normal', 'in-progress'),
  ('REQ-004', 4, 'อื่น ๆ', 'อาคาร B ห้อง 202',
   'ขอข้อมูลบริการของหน่วยงาน', 'normal', 'completed'),
  ('REQ-005', 1, 'แจ้งซ่อม', 'อาคาร A ห้อง 105',
   'เครื่องพิมพ์กระดาษติด', 'urgent', 'pending');
