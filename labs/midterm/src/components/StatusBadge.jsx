function StatusBadge({ status }) {
  const statusMap = {
    pending: 'รอดำเนินการ',
    'in-progress': 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
  };

  return (
    <span className={`status-badge status-${status}`}>
      {statusMap[status] || 'ไม่ทราบสถานะ'}
    </span>
  );
}

export default StatusBadge;