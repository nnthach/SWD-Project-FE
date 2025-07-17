import styles from './Service.module.scss';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import SearchBar from '~/components/SearchBar/SearchBar';
import ServiceFilter from '~/components/ServiceFilter/ServiceFilter';
import { useEffect, useState } from 'react';
import { getAllServiceAPI } from '~/services/serviceService';

function Service() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const handleSearch = (query) => {
    const filteredResult = services.filter((item) =>
      item.serviceName.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(filteredResult);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getAllServiceAPI();
        setServices(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu dịch vụ:', err);
      }
    };
    fetchServices();
  }, []);

  const displayServices = selectedCategories.length
    ? filtered.filter((item) =>
        selectedCategories.includes(item.category || 'Khác')
      )
    : filtered;

  return (
    <div className={styles['service-wrap']}>
      <div className={styles.banner}>
        <div className={styles['banner-content']}>
          <div>
            <p className={styles.breadcrumb}>
              Trang chủ / <strong>Dịch vụ</strong>
            </p>
            <h1>Service</h1>
          </div>
        </div>
      </div>

      <div className={styles['service-content']}>
        <div className={styles['service-table']}>
          <div className={styles['service-search']}>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className={styles['service-grid']}>
            {displayServices.map((item) => (
              <ServiceCard key={item.serviceId} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Service;
