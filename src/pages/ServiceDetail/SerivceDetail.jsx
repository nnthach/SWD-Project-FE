import { useParams } from 'react-router-dom';
import styles from './ServiceDetail.module.scss';
import { useEffect, useState } from 'react';
import BookingPopup from '~/components/BookingPopup/BookingPopup';
import { getServiceDetailAPI } from '~/services/serviceService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      navigate('/auth/login');
    } else {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await getServiceDetailAPI(id);
        setService(res.data);
      } catch (err) {
        console.error('Không thể tải chi tiết dịch vụ', err);
      }
    };
    fetchService();
  }, [id]);

  if (!service) {
    return <p>Đang tải dữ liệu dịch vụ...</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.info}>
          <p className={styles.breadcrumb}>
            Trang chủ / Xét nghiệm / {service.category || 'Danh mục'} /{' '}
            <strong>{service.serviceName}</strong>
          </p>
          <h1>{service.serviceName}</h1>
          <p className={styles.price}>{service.price?.toLocaleString()}đ</p>
          <div className={styles.buttons}>
            <button onClick={handleBookingClick} className={styles.book}>
              Đặt lịch hẹn
            </button>
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
          {['Đăng ký xét nghiệm', 'Lấy mẫu xét nghiệm', 'Trả kết quả', 'Bác sĩ tư vấn miễn phí'].map((step, index) => (
            <div className={styles.step} key={index}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div>
                <strong>{step}</strong>
                <p>Mô tả quy trình {index + 1} sẽ được điền sau</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className={styles.bookBtn}
        >
          Đặt lịch hẹn
        </button>
      </div>

      <BookingPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
        selectedServiceIds={[service.serviceId]} 
      />
    </div>
  );
}

export default ServiceDetail;
