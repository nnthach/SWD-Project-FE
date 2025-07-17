import styles from './BookingPopup.module.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createBooking } from '~/services/bookingService';


function BookingPopup({ isOpen, onClose, selectedServiceIds = [] }) {
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    note: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('accessToken');
    if (!token) {
      toast.error("Bạn cần đăng nhập để đặt lịch.");
      return;
    }

    if (!bookingData.bookingDate) {
      toast.error("Vui lòng chọn ngày hẹn.");
      return;
    }

    try {
      const bookingDate = new Date(`${bookingData.bookingDate}T00:00:00`);
      if (isNaN(bookingDate.getTime())) {
        throw new Error("Ngày không hợp lệ");
      }

      const requestBody = {
        bookingDate: bookingDate.toISOString(),
        note: bookingData.note, // Đúng là .note (không phải .notes!)
        serviceIds: selectedServiceIds,
      };

      console.log("Gửi dữ liệu đặt lịch:", requestBody);

      await createBooking(requestBody);
      toast.success("Đặt lịch thành công!");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Đặt lịch thất bại:", error);
      toast.error("Đặt lịch thất bại. Vui lòng thử lại.");
    }
  };

  const resetForm = () => {
    setBookingData({
      bookingDate: '',
      note: '',
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
            <label>Ngày hẹn *</label>
            <input
              type="date"
              name="bookingDate"
              value={bookingData.bookingDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ghi chú</label>
            <textarea
              name="note"
              value={bookingData.note}
              onChange={handleChange}
              rows="3"
              placeholder="Ghi chú thêm (nếu có)"
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
