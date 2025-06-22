import { useState, useEffect } from 'react';
import { useConsultant } from '~/context/ConsultantContext';
import { toast } from 'react-toastify';
import styles from './BookConsultant.module.scss';

function BookConsultant() {
  const {
    filteredConsultants,
    specializations,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    createAppointment,
    clearError
  } = useConsultant();

  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    startTime: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });
  // Clear any errors on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle consultant selection
  const handleSelectConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    setShowBookingModal(true);
  };

  // Handle booking form change
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.appointmentDate || !bookingData.startTime || 
        !bookingData.customerName || !bookingData.customerPhone || 
        !bookingData.customerEmail) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Check if selected time is available
    if (!selectedConsultant.availableSlots.includes(bookingData.startTime)) {
      toast.error('Khung giờ đã chọn không có sẵn!');
      return;
    }

    try {
      // Create appointment using context
      const appointmentData = {
        user_id: '999', // Current user ID (should come from auth context)
        consultant_id: selectedConsultant.consultant_id,
        appointmentDate: bookingData.appointmentDate,
        startTime: bookingData.startTime,
        endTime: getEndTime(bookingData.startTime),
        consultantName: selectedConsultant.name,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerEmail: bookingData.customerEmail,
        notes: bookingData.notes
      };

      await createAppointment(appointmentData);
      toast.success('Đặt lịch tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      
      // Reset form and close modal
      setBookingData({
        appointmentDate: '',
        startTime: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        notes: ''
      });
      setShowBookingModal(false);
      setSelectedConsultant(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
    }
  };

  // Get end time (1 hour after start time)
  const getEndTime = (startTime) => {
    const hour = parseInt(startTime.split(':')[0]);
    return `${hour + 1}:00`;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}>Đang tải...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}
      
      <div className={styles.header}>
        <h1>Đặt Lịch Tư Vấn</h1>
        <p>Chọn chuyên gia phù hợp với nhu cầu của bạn</p>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm chuyên gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filters}>
          <select 
            value={filters.specialization || ''} 
            onChange={(e) => setFilters({ specialization: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="">Tất cả chuyên ngành</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="rating">Sắp xếp theo đánh giá</option>
            <option value="price">Sắp xếp theo giá</option>
            <option value="experience">Sắp xếp theo kinh nghiệm</option>
          </select>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className={styles.consultantsGrid}>
        {filteredConsultants.map(consultant => (
          <div key={consultant.consultant_id} className={styles.consultantCard}>
            <div className={styles.consultantHeader}>
              <img 
                src={consultant.avatar} 
                alt={consultant.name}
                className={styles.avatar}
              />
              <div className={styles.rating}>
                <span>⭐ {consultant.rating}</span>
              </div>
            </div>
            
            <div className={styles.consultantInfo}>
              <h3>{consultant.name}</h3>
              <p className={styles.specialization}>{consultant.specialization}</p>
              <p className={styles.experience}>{consultant.experience}</p>
              <p className={styles.description}>{consultant.description}</p>
              <div className={styles.price}>{formatPrice(consultant.price)}/buổi</div>
            </div>

            <div className={styles.availability}>
              <p><strong>Khung giờ có sẵn:</strong></p>
              <div className={styles.timeSlots}>
                {consultant.availableSlots.map(slot => (
                  <span key={slot} className={styles.timeSlot}>{slot}</span>
                ))}
              </div>
            </div>

            <button 
              className={styles.bookButton}
              onClick={() => handleSelectConsultant(consultant)}
            >
              Đặt Lịch
            </button>
          </div>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className={styles.noResults}>
          <p>Không tìm thấy chuyên gia phù hợp</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedConsultant && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Đặt lịch với {selectedConsultant.name}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label>Ngày hẹn *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={bookingData.appointmentDate}
                  onChange={handleBookingChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Giờ hẹn *</label>
                <select
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Chọn giờ</option>
                  {selectedConsultant.availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="customerName"
                  value={bookingData.customerName}
                  onChange={handleBookingChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={bookingData.customerPhone}
                  onChange={handleBookingChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={bookingData.customerEmail}
                  onChange={handleBookingChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ghi chú</label>
                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleBookingChange}
                  placeholder="Mô tả vấn đề cần tư vấn (tùy chọn)"
                  rows="4"
                />
              </div>

              <div className={styles.bookingSummary}>
                <p><strong>Tóm tắt đặt lịch:</strong></p>
                <p>Chuyên gia: {selectedConsultant.name}</p>
                <p>Chuyên ngành: {selectedConsultant.specialization}</p>
                <p>Chi phí: {formatPrice(selectedConsultant.price)}</p>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowBookingModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookConsultant;
