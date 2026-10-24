
import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map();

// ให้ checker รีเซ็ตตัวนับก่อนทดสอบได้
export function resetLoginLimiter() {
  failedAttempts.clear();
}

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(key) {
  const record = failedAttempts.get(key);

  if (!record) return false;

  if (Date.now() - record.firstAttemptAt >= WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }

  return record.count >= MAX_FAILED_ATTEMPTS;
}

router.post('/login', (req, res) => {
  const key = getClientKey(req);

  // บล็อกก่อนตรวจสอบข้อมูล Login เมื่อผิดครบ 5 ครั้ง
  if (isRateLimited(key)) {
    return res.status(429).json({
      error: 'พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง',
    });
  }

  const errors = validateLoginInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง',
      details: errors,
    });
  }

  const result = authService.login(
    req.body.email,
    req.body.password,
  );

  if (!result) {
    const now = Date.now();
    const record = failedAttempts.get(key);

    if (!record || now - record.firstAttemptAt >= WINDOW_MS) {
      failedAttempts.set(key, {
        count: 1,
        firstAttemptAt: now,
      });
    } else {
      record.count += 1;
    }

    return res.status(401).json({
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    });
  }

  // Login สำเร็จให้ล้างตัวนับของ IP นี้
  failedAttempts.delete(key);

  return res.status(200).json(result);
});

export default router;
