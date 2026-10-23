import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    });
  });

  test('นับคำร้องสถานะ in-progress ได้ถูกต้อง', () => {
    const requests = [
      { id: 'REQ-001', status: 'pending' },
      { id: 'REQ-002', status: 'in-progress' },
      { id: 'REQ-003', status: 'in-progress' },
      { id: 'REQ-004', status: 'completed' },
    ];

    expect(summarizeRequests(requests)).toEqual({
      total: 4,
      pending: 1,
      inProgress: 2,
      completed: 1,
    });
  });
});
