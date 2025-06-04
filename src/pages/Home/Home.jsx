import Footer from '~/components/Layout/components/Footer/Footer';
import Header from '~/components/Layout/components/Header/Header';
import styles from './Home.module.scss';
function Home() {
  return (
    <div className={styles['home-wrap']}>
      <Header />
      <div className={styles['home-new-content']}>
        {/*Banner */}
        <div className={styles['home-banner']}>
          <img src="https://copcp.s3.us-east-2.amazonaws.com/Images/Headers/Mobile/Find+a+Doctor.jpg" />
        </div>

        {/*Our Service */}
        <div className={styles['home-service']}>
          <h1>Our Services</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
