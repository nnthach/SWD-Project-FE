import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import styles from './Pagination.module.scss';

function Pagination({ productsPerPage, totalProducts, currentPage, setCurrentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <FaLongArrowAltLeft
          onClick={() => {
            if (currentPage == 1) {
              return;
            } else {
              setCurrentPage((prev) => prev - 1);
            }
          }}
          className={styles.icon}
        />
        <div className={styles['number-wrap']}>
          {pageNumbers.map((page) => (
            <span
              key={page}
              onClick={() => {
                if (currentPage !== page) {
                  setCurrentPage(page);
                }
              }}
              className={`${currentPage === page ? styles.isActive : ''}`}
            >
              {page}
            </span>
          ))}
        </div>
        <FaLongArrowAltRight
          onClick={() => {
            if (currentPage == pageNumbers.length) {
              return;
            } else {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          className={styles.icon}
        />
      </div>
    </div>
  );
}

export default Pagination;
