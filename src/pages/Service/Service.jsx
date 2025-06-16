import styles from './Service.module.scss';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import { fakeDataServiceCard } from '~/constants/fakeData';
import SearchBar from '~/components/SearchBar/SearchBar';
import ServiceFilter from '~/components/ServiceFilter/ServiceFilter';
import { useState } from 'react';

function Service() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = (query) => {
    console.log('Tìm kiếm:', query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredServices = selectedCategories.length
    ? fakeDataServiceCard.filter((item) =>
        selectedCategories.includes(item.category)
      )
    : fakeDataServiceCard;

  return (
    <div className={styles['service-wrap']}>
      <div className={styles.banner}>
        <div className={styles['banner-content']}>
          <div>
            <p className={styles.breadcrumb}>Trang chủ / <strong>Dịch vụ</strong></p>
            <h1>Service</h1>
          </div>
        </div>
      </div>
      <div className={styles['service-content']}>
        <div className={styles['service-filter']}>
          <ServiceFilter
            selectedCategories={selectedCategories}
            onChange={handleCategoryChange}
          />
        </div>

        <div className={styles['service-table']}>
          <div className={styles['service-search']}>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className={styles['service-grid']}>
            {filteredServices.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Service;
