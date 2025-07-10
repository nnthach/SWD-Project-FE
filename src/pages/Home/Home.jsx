/* eslint-disable no-unused-vars */
import styles from './Home.module.scss';
import homeBanner from '~/assets/images/home_banner.jpg';
import homeBanner2 from '~/assets/images/home_banner2.jpg';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ServiceContext } from '~/context/ServiceContext';
import BlogCard from '~/pages/Home/BlogCard/BlogCard';
function Home() {
  const { servicesListData, fetchAllServices } = useContext(ServiceContext);
  console.log('servicelistdat home', servicesListData);

  // useEffect(() => {
  //   fetchAllServices();
  // }, []);
  return (
    <div className={styles['home-wrap']}>
      <div className={styles['home-new-content']}>
        {/*Banner */}
        <div className={styles['home-banner']}>
          <img src={homeBanner} alt="banner" />
        </div>

        {/*Our Service */}
        <div className={styles['home-service']}>
          <h1>Our Services</h1>
          <div className={styles['service-wrap']}>
            {servicesListData && servicesListData.map((item) => <ServiceCard item={item} key={item.serviceId} />)}
          </div>

          <button className={styles['service-page-btn']}>
            <Link to={'/service'} style={{ textDecoration: 'none', color: 'white' }}>
              View Our Services
            </Link>
          </button>
        </div>

        <div className={styles['home-banner']}>
          <img src={homeBanner2} alt="banner" />
        </div>

        <div className={styles['home-service']}>
          <h1>Blogs</h1>
          <div className={styles['service-wrap']}>
            {/* {servicesListData && servicesListData.map((item) => <ServiceCard item={item} key={item.serviceId} />)} */}

            <BlogCard />
          </div>

          <button className={styles['service-page-btn']}>
            <Link to={'/blog'} style={{ textDecoration: 'none', color: 'white' }}>
              View More Blogs
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
