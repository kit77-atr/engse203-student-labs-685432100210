/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน requestService จะเรียกผ่านตรงนี้
 */

/**
 * TODO W07-F1 (CP11) · อ่าน base URL จาก environment
 *   import.meta.env.VITE_API_BASE_URL
 *
 * ถ้าไม่มีการกำหนดค่า ให้ใช้ Render API สำหรับ GitHub Pages
 */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://engse203-student-labs-685432100210-2.onrender.com';

/** error ที่รู้ว่ามาจาก API พร้อม status ที่ได้กลับมา */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

/**
 * TODO W07-F2 (CP11)
 *
 * 1. ต่อเซิร์ฟเวอร์ไม่ได้ → ApiError status 0
 * 2. ตอบ 4xx/5xx → ApiError พร้อม status
 * 3. ตอบ 204 → คืน null
 * 4. ตอบ 2xx อื่น → คืน response.json()
 */
export async function apiFetch(path, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      'ติดต่อเซิร์ฟเวอร์ไม่ได้ — กรุณาตรวจสอบการเชื่อมต่อ API',
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) return null;

  return response.json();
}