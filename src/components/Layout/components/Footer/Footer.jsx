import styles from './Footer.module.scss';

function Footer() {
  const footerData = [
    {
      header: 'Quick Link',
      list: [
        { title: 'About Us' },
        { title: 'Hiring' },
        { title: 'News & Events' },
        { title: 'Team of Doctors' },
        { title: 'Medical Services' },
        { title: 'FAQs' },
      ],
    },
    {
      header: 'Policies',
      list: [
        { title: 'Privacy Policy' },
        { title: 'Terms of Use' },
        { title: 'Data Protection (Customers)' },
        { title: 'Data Protection (Applicants)' },
        { title: 'Refund & Cancellation' },
      ],
    },
    {
      header: 'Contact',
      list: [
        { title: '414-420 Cao Thang St, District 10, HCMC' },
        { title: 'Phone: (028) 1234 5678' },
        { title: 'Email: contact@medicaldiag.vn' },
      ],
    },
  ];

  return (
    <div className={styles['footer-wrap']}>
      {/*Footer top */}
      <div className={styles['footer-top']}>
        <div>Logo</div>
        <p>1900 1717</p>
      </div>

      {/*Footer bottom */}
      <div className={styles['footer-bottom']}>
        {/*Introduction */}
        <div className={styles['footer-intro']}>
          <h5>LAB GROUP INTERNATIONAL VIETNAM CO., LTD</h5>
          <div className={styles['footer-intro-para']}>
            <p>
              Business Registration Certificate No.: 0301482205 Issued by the Department of Planning and Investment of
              Ho Chi Minh City First issued on September 26, 2008.
            </p>

            <p>Medical Practice License No.: 06454/HCM-GPHĐ Issued by the Department of Health of Ho Chi Minh City.</p>

            <p>
              Address:
              <br /> General Clinic – Laboratory & Medical Diagnostic Center – Medical Diag Center 414-420 Cao Thang
              Street, Ward 12, District 10, Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>
        {/*Content */}
        <div className={styles['footer-content-wrap']}>
          {footerData.map((item, index) => (
            <div key={index} className={styles['footer-content']}>
              <h5>{item.header}</h5>
              <ul>
                {item.list.map((link, subIndex) => (
                  <li key={subIndex}>{link.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
