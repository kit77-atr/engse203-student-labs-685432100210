import { useState } from 'react';

function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState({
    requesterName: '',
    requestType: '',
    location: '',
    details: '',
    priority: 'normal',
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.requesterName.trim() || formData.requesterName.trim().length < 2) {
      newErrors.requesterName = 'ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    if (!formData.requestType) {
      newErrors.requestType = 'กรุณาเลือกประเภทคำร้อง';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'กรุณาระบุสถานที่';
    }
    if (!formData.details.trim() || formData.details.trim().length < 10) {
      newErrors.details = 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร';
    }
    if (!['normal', 'urgent'].includes(formData.priority)) {
      newErrors.priority = 'กรุณาเลือกความเร่งด่วนที่ถูกต้อง';
    }
    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback('กรุณากรอกข้อมูลให้ถูกต้องตามเงื่อนไข');
      return;
    }

    onAddRequest({
      requesterName: formData.requesterName.trim(),
      requestType: formData.requestType,
      location: formData.location.trim(),
      details: formData.details.trim(),
      priority: formData.priority,
    });

    setFormData({
      requesterName: '',
      requestType: '',
      location: '',
      details: '',
      priority: 'normal',
    });
    setErrors({});
    setFeedback('เพิ่มคำร้องสำเร็จแล้ว');
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requesterName)}
          />
          <small className="error" id="requesterName-error">{errors.requesterName}</small>
        </div>

        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestType)}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>
          <small className="error" id="requestType-error">{errors.requestType}</small>
        </div>

        <div className="field">
          <label htmlFor="location">สถานที่</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
          />
          <small className="error" id="location-error">{errors.location}</small>
        </div>

        <div className="field">
          <label htmlFor="details">รายละเอียด</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            aria-invalid={Boolean(errors.details)}
          ></textarea>
          <small className="error" id="details-error">{errors.details}</small>
        </div>

        <div className="field">
          <label htmlFor="priority">ความเร่งด่วน</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-invalid={Boolean(errors.priority)}
          >
            <option value="normal">ปกติ</option>
            <option value="urgent">เร่งด่วน</option>
          </select>
          <small className="error" id="priority-error">{errors.priority}</small>
        </div>

        <button type="submit">เพิ่มคำร้อง</button>
        <p className="status" role="status">{feedback}</p>
      </form>
    </section>
  );
}

export default RequestForm;
