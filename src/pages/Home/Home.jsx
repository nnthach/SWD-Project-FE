/* eslint-disable no-unused-vars */
import styles from './Home.module.scss';
import homeBanner from '~/assets/images/home_banner.jpg';
import homeBanner2 from '~/assets/images/home_banner2.jpg';
import homeBanner3 from '~/assets/images/home_banner3.jpg';
import hospitalImg from '~/assets/images/hospital.jpg';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ServiceContext } from '~/context/ServiceContext';
import BlogCard from '~/pages/Home/BlogCard/BlogCard';
import Slider from 'react-slick';
import { motion } from 'framer-motion';

function Home() {
  const { servicesListData, fetchAllServices } = useContext(ServiceContext);
  console.log('servicelistdat home', servicesListData);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
  };
  console.log('dot env', import.meta.env.VITE_APP_ID);

  return (
    <div className={styles['home-wrap']}>
      <div className={styles['home-new-content']}>
        {/*Banner */}
        <div className="slider-container">
          <Slider {...settings}>
            <div className={styles['home-banner']}>
              <img src={homeBanner} alt="banner" />
            </div>
            <div className={styles['home-banner']}>
              <img src={homeBanner2} alt="banner" />
            </div>
            <div className={styles['home-banner']}>
              <img src={homeBanner3} alt="banner" />
            </div>
          </Slider>
        </div>

        {/*About us */}
        <div className={styles['home-about-us']}>
          <h1>About Us</h1>
          <div className={styles['about-us-content']}>
            <motion.div
              className={styles['content-left']}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ amount: 0.5 }}
            >
              <p>
                At <strong>Gender Health Care</strong>, we believe that healthcare is not just about treatment – it's
                about people. Our mission is to deliver exceptional medical care with empathy, precision, and respect
                for every individual. With a legacy of trust and innovation, we proudly serve our community as a leading
                healthcare provider.
                <br />
                <br /> Our hospital is home to a multidisciplinary team of highly qualified doctors, dedicated nurses,
                and compassionate support staff who work tirelessly to ensure the best outcomes for our patients.
                Equipped with modern medical technology and state-of-the-art facilities, we provide a comprehensive
                range of services, including general medicine, surgery, pediatrics, cardiology, emergency care, and
                specialized treatments.
                <br />
                <br /> Patient safety and comfort are at the core of everything we do. From the moment you enter our
                hospital, we are committed to creating a healing environment built on trust, professionalism, and
                personalized attention. We take the time to listen, understand your needs, and provide care tailored to
                your health journey.
                <br />
                <br /> We also emphasize continuous improvement through research, training, and community outreach
                programs. Our goal is not only to treat illness but to promote long-term wellness and preventive care
                for individuals and families.
                <br />
                <br /> Thank you for choosing <strong>Gender Health Care</strong> – your health, our mission.
              </p>
            </motion.div>
            <motion.div
              className={styles['content-right']}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ amount: 0.5 }}
            >
              <img src={hospitalImg} />
            </motion.div>
          </div>
        </div>

        {/*Our Service */}
        <div className={styles['home-service']}>
          <h1>Our Services</h1>
          <div className={styles['service-wrap']}>
            {servicesListData &&
              servicesListData?.$values?.slice(0, 9).map((item) => <ServiceCard item={item} key={item.serviceId} />)}
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
