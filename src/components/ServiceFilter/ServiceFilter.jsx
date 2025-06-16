import React from 'react';
import styles from './ServiceFilter.module.scss';

const categories = [
  'Bộ Mỡ',
  'Chẩn Đoán Hình Ảnh',
  'Điện Di',
  'Đông Máu',
  'Hệ miễn dịch',
  'Khác',
  'Ký sinh trùng',
  'Máu',
  'Nhiễm Trùng/ Truyền Nhiễm',
  'Nhóm Máu',
  'Nhóm Xét Nghiệm Ung Thư',
  'Nội tiết & Hormon',
  'Nước Tiểu'
];

function ServiceFilter({ selectedCategories, onChange }) {
  return (
    <div className={styles.filter}>
      {categories.map((cat) => (
        <div key={cat} className={styles.item}>
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => onChange(cat)}
            />
            {cat}
          </label>
        </div>
      ))}
    </div>
  );
}

export default ServiceFilter;
