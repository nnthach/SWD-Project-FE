import styles from './BookingPopup.module.scss';
import { useState } from 'react';
import { fakeConsultants } from '~/constants/fakeData';
import { toast } from 'react-toastify';


function BookingPopup({ isOpen, onClose }) {
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    startTime: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
    selectedDoctor: '',
  });

  const selectedConsultant = fakeConsultants.find((c) => String(c.consultant_id) === bookingData.selectedDoctor);


  const handleOpenBooking = (id) => {
    const found = fakeConsultants.find(c => c.consultant_id === id);
    setSelectedConsultant(found); 
    setShowBookingModal(true);
  };


  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking Info:', bookingData);
    toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm.');
    onClose();

    setBookingData({
      appointmentDate: '',
      startTime: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      notes: '',
      selectedDoctor: '',
    });
  };


  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Đặt lịch xét nghiệm</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <div className={styles.formGroup}>
            <label>Họ và tên *</label>
            <input
              type="text"
              name="customerName"
              value={bookingData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="customerPhone"
              value={bookingData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Bác sĩ tư vấn *</label>
            <select
              name="selectedDoctor"
              value={bookingData.selectedDoctor}
              onChange={handleChange}
              required
            >
              <option value="">Chọn bác sĩ</option>
              {fakeConsultants.map(c => (
                <option key={c.consultant_id} value={c.consultant_id}>
                  {c.name} - {c.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Ngày hẹn *</label>
            <input
              type="date"
              name="appointmentDate"
              value={bookingData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giờ hẹn *</label>
            <select
              name="startTime"
              value={bookingData.startTime}
              onChange={handleChange}
              required
            >
              <option value="">Chọn giờ</option>
              {selectedConsultant?.availableSlots?.length > 0 ? (
                selectedConsultant.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))
              ) : (
                <option disabled>(Không có khung giờ khả dụng)</option>
              )}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Ghi chú</label>
            <textarea
              name="notes"
              value={bookingData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Hủy</button>
            <button type="submit" className={styles.submitButton}>Xác nhận đặt lịch</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPopup;
