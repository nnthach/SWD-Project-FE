import { useParams } from 'react-router-dom';
import { fakeDataServiceCard } from '~/constants/fakeData';
import styles from './ServiceDetail.module.scss';
import { useState } from 'react';
import BookingPopup from '~/components/BookingPopup/BookingPopup';

function ServiceDetail() {
  const { id } = useParams();
  const service = fakeDataServiceCard.find(item => String(item.id) === id);

  const [showPopup, setShowPopup] = useState(false);

  if (!service) {
    return <p>Không tìm thấy dịch vụ</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.info}>
          <p className={styles.breadcrumb}>
            Trang chủ / Xét nghiệm / {service.category || 'Danh mục'} / <strong>{service.name}</strong>
          </p>
          <h1>{service.name}</h1>
          <p className={styles.price}>{service.price.toLocaleString()}đ</p>
          <div className={styles.buttons}>
            <button onClick={() => setShowPopup(true)} className={styles.book}>Đặt lịch hẹn</button>

            <button className={styles.location}>Tìm địa điểm</button>
          </div>
          <span className={styles.category}>{service.category || 'Danh mục'}</span>
        </div>
      </div>

      <div className={styles.description}>
        <h2>Giới thiệu dịch vụ</h2>
        <p>{service.descriptionLong || service.description}</p>
      </div>
      <div className={styles.processBox}>
        <h2>Quy trình xét nghiệm</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <strong>Đăng ký xét nghiệm</strong>
              <p>Đăng ký online cho lấy mẫu xét nghiệm tại nhà hoặc đến các điểm lấy mẫu của Diag</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <strong>Lấy mẫu xét nghiệm</strong>
              <p>Điều dưỡng sẽ lấy mẫu xét nghiệm</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <strong>Trả kết quả</strong>
              <p>Kết quả xét nghiệm sẽ được gửi cho khách hàng bằng SMS hoặc Zalo</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div>
              <strong>Bác sĩ tư vấn miễn phí</strong>
              <p>Nhận tư vấn từ xa miễn phí hoặc theo dõi kết quả với bác sĩ riêng của bạn</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowPopup(true)} className={styles.bookBtn}>Đặt lịch hẹn</button>
      </div>
      
      <BookingPopup isOpen={showPopup} onClose={() => setShowPopup(false)} serviceId={service.id}/>
    </div>
  );
}

export default ServiceDetail;
