/* eslint-disable no-unused-vars */
import api from '~/config/axios';
import styles from './ModalBooking.module.scss';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Image, Upload } from 'antd';
import uploadFile from '~/utils/upload';
import { FaPlus } from 'react-icons/fa';
import { createTestResultAPI } from '~/services/testResultService';

function ModalBooking({ isDetailLoading, bookingDetailData, setOpenPopup, setBookingDetailData }) {
  const [updateTestResultForm, setUpdateTestResultForm] = useState({
    testBookingServiceId: bookingDetailData?.testBookingServices?.$values[0]?.id,
    testName: bookingDetailData?.services?.$values[0].serviceName,
    resultDetail: '',
  });

  const [isLoadingAddResult, setIsLoadingAddResult] = useState(false);

  // Start UPLOAD IMAGE
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChangeImage = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <FaPlus color="black" fontSize={30} />
      <div style={{ marginTop: 8, color: 'black' }}>Upload</div>
    </button>
  );
  // End IMAGE UPLOAD

  const handleUpdateBooking = async (status) => {
    try {
      const res = await api.put(`/Booking/${status}/${bookingDetailData.bookingId}`);
      console.log('update booking res', res);
      toast.success('Update booking successful');
      setOpenPopup(false);
    } catch (error) {
      console.log('update booking err', error);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    setIsLoadingAddResult(true);

    let imageUrl = updateTestResultForm.resultDetail;
    if (fileList[0]?.originFileObj) {
      imageUrl = await uploadFile(fileList[0].originFileObj);
      console.log('Uploaded URL:', imageUrl);
    }

    const newTestResultData = {
      ...updateTestResultForm,
      resultDetail: imageUrl,
    };

    console.log('newTestResultData', newTestResultData);

    try {
      const res = await createTestResultAPI(newTestResultData);
      console.log('add test result res', res);
      setFileList([]);
      setUpdateTestResultForm((prev) => ({
        ...prev,
        resultDetail: '',
      }));

      // // rerender detail
      // const resdetail = await api.get(`/Booking/my-bookings/${bookingDetailData?.bookingId}`);
      // console.log('get  booking detail res', resdetail);
      // setBookingDetailData(res.data);
      setOpenPopup(false);
      setIsLoadingAddResult(false);
    } catch (error) {
      console.log('Create test result error', error);
      setIsLoadingAddResult(false);
    }
  };

  return (
    <div className={styles['popup-wrap']}>
      <div className={styles.overlay} />
      <p
        className={styles['close-btn']}
        onClick={() => {
          setOpenPopup(false);
        }}
      >
        &times;
      </p>

      {/*Content */}
      {isLoadingAddResult ? (
        <div>
          <p style={{ color: 'white' }}>Loading</p>
        </div>
      ) : isDetailLoading ? (
        <div>
          <p style={{ color: 'white' }}>Loading</p>
        </div>
      ) : (
        <div className={styles.content}>
          {/*Top */}
          <div className={styles.topContent}>
            <h2>
              Booking Detail{' '}
              <span
                className={`${styles['booking-status']} ${
                  bookingDetailData.status === 'DELETED'
                    ? styles.cancel
                    : bookingDetailData.status === 'COMPLETE'
                    ? styles.complete
                    : ''
                }`}
              >
                {bookingDetailData.status}
              </span>
            </h2>
            <div className={styles['booking-info']}>
              <p>
                <strong>ID:</strong> {bookingDetailData?.bookingId}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(bookingDetailData.bookingDate).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
              <p>
                <strong>Note:</strong>
                {bookingDetailData.note}
              </p>
              <p>
                <strong>Total Price:</strong> {bookingDetailData?.totalPrice}
              </p>
            </div>
          </div>
          <div className={styles.bottomContentWrap}>
            <div className={styles.bottomContentRight}>
              <div className={styles.serviceBox}>
                <h2>User</h2>
                <div className={styles['booking-info']}>
                  <p>
                    <strong>User ID:</strong> {bookingDetailData.userId}
                  </p>
                </div>
              </div>
            </div>

            {/*Bottom */}
            <div className={styles.bottomContentLeft}>
              {bookingDetailData.services?.$values.map((service) => (
                <div key={service.serviceId} className={styles.serviceBox}>
                  <h2>Service</h2>
                  <div className={styles['booking-info']}>
                    <p>
                      <strong>ID:</strong> {service.serviceId}
                    </p>
                    <p>
                      <strong>Service Name:</strong> {service.serviceName}
                    </p>
                    <p>
                      <strong>Price:</strong> {service.price}
                    </p>
                    <p>
                      <strong>Description:</strong> {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*Test result */}
          {bookingDetailData.status != 'PENDING' && bookingDetailData.status != 'DELETED' && (
            <div className={styles['result-content']}>
              <h2>Test Result</h2>

              {bookingDetailData?.testBookingServices?.$values[0]?.testResults?.$values[0]?.resultDetail ? (
                <div className={styles['test-result-img-wrap']}>
                  <img src={bookingDetailData.testBookingServices.$values[0].testResults.$values[0].resultDetail} />
                </div>
              ) : (
                <>
                  <div className={styles['upload-field']}>
                    <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChangeImage}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </div>
                  <button onClick={handleSubmitForm}>Update result</button>
                </>
              )}
            </div>
          )}

          {bookingDetailData.status == 'PENDING' && (
            <div className={styles['btn-wrap']}>
              <button onClick={() => handleUpdateBooking('cancel')}>Cancel</button>
              <button onClick={() => handleUpdateBooking('complete')}>Complete</button>
            </div>
          )}
        </div>
      )}
      {/*end Content */}

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
            zIndex: 2000,
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default ModalBooking;
