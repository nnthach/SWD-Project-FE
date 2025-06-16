import React from 'react';
import styles from './BookingPopup.module.scss';

export default function BookingPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <h3>Để lại số điện thoại để nhận cuộc gọi tư vấn miễn phí!</h3>
        <form>
          <label>Họ tên <span>*</span></label>
          <input type="text" placeholder="Họ tên" required />

          <label>Số điện thoại <span>*</span></label>
          <input type="tel" placeholder="Số điện thoại" required />

          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
}
