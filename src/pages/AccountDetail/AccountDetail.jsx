import Footer from '~/components/Layout/components/Footer/Footer';
import Header from '~/components/Layout/components/Header/Header';
import styles from './/AccountDetail.module.scss';

function AccountDetail() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <p>account detail</p>
      </div>
      <Footer />
    </div>
  );
}

export default AccountDetail;
