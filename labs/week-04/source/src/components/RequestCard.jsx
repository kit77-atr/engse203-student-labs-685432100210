function RequestCard({ request, onDeleteRequest }) {
  const priorityLabel = request.priority === 'urgent' ? 'เร่งด่วน' : 'ปกติ';
  const statusLabels = {
    pending: 'รอดำเนินการ',
    'in-progress': 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
  };

  return (
    <article className="request-card">
      <div>
        <div className="card-header-tags">
          <span className="request-id">{request.id}</span>
          <span className={`badge priority-${request.priority}`}>{priorityLabel}</span>
          <span className={`badge status-${request.status}`}>{statusLabels[request.status] || request.status}</span>
        </div>
        <h3>{request.requestType}</h3>
        <p className="requester"><strong>ผู้แจ้ง:</strong> {request.requesterName}</p>
        <p className="location"><strong>สถานที่:</strong> {request.location}</p>
        <p className="details">{request.details}</p>
      </div>
      <button
        type="button"
        onClick={() => onDeleteRequest(request.id)}
        aria-label={`ลบคำร้อง ${request.id}`}
      >
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;
