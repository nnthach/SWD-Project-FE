import { useState, useEffect } from 'react';
import { useConsultant } from '~/context/ConsultantContext';
import { toast } from 'react-toastify';
import styles from './BookConsultant.module.scss';
import * as staffConsultantService from '~/services/staffConsultantService';
import { getAllAppointmentAPI, createAppointmentAPI } from '~/services/appointmentService';

// Define fixed time slots
const FIXED_SLOTS = [
  { id: 1, label: '7:00 - 9:00', value: 1 },
  { id: 2, label: '9:00 - 11:00', value: 2 },
  { id: 3, label: '13:00 - 15:00', value: 3 },
  { id: 4, label: '15:00 - 17:00', value: 4 }
];

function BookConsultant() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    clearError
  } = useConsultant();

  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedAppointments, setBookedAppointments] = useState({});
  
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    slot: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });

  // Fetch consultants
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await staffConsultantService.getAllStaffConsultantAPI("157f0b62-afbb-44ce-91ce-397239875df5");
        
        if (response && response.data) {
          const consultantData = response.data.map(consultant => ({
            consultant_id: consultant.userId,
            name: consultant.fullName || consultant.username,
            email: consultant.email,
            phone: consultant.phoneNumber,
            specialization: "Consultant", // Default value or fetch from another API if needed
            experience: "Experience", // Placeholder
            rating: 5, // Placeholder
            price: 300000, // Placeholder
            description: "Professional consultant", // Placeholder
            avatar: "https://via.placeholder.com/150", // Placeholder
          }));
          
          setConsultants(consultantData);
          setFilteredConsultants(consultantData);
          
          // Extract unique specializations
          const specs = [...new Set(consultantData.map(c => c.specialization))];
          setSpecializations(specs);
          
          // Fetch booked appointments for each consultant
          consultantData.forEach(async (consultant) => {
            await fetchConsultantAppointments(consultant.consultant_id);
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load consultants");
        toast.error("Failed to load consultants");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultants();
  }, []);

  // Fetch appointments for a consultant
  const fetchConsultantAppointments = async (consultantId) => {
    try {
      const params = { consultantId };
      const response = await getAllAppointmentAPI(params);
      
      if (response && response.data) {
        setBookedAppointments(prev => ({
          ...prev,
          [consultantId]: response.data
        }));
      }
    } catch (err) {
      console.error("Failed to fetch appointments for consultant", consultantId, err);
    }
  };

  // Filter consultants when search or filters change
  useEffect(() => {
    let filtered = [...consultants];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.specialization) {
      filtered = filtered.filter(c => c.specialization === filters.specialization);
    }
    
    // Sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'experience':
        filtered.sort((a, b) => a.experience.localeCompare(b.experience));
        break;
      default:
        break;
    }
    
    setFilteredConsultants(filtered);
  }, [consultants, searchTerm, filters, sortBy]);

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

  // Check if a slot is available for a specific date
  const isSlotAvailable = (date, slotValue) => {
    if (!selectedConsultant || !bookedAppointments[selectedConsultant.consultant_id]) {
      return true;
    }
    
    const consultantAppointments = bookedAppointments[selectedConsultant.consultant_id];
    const selectedDate = new Date(date);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedDay = selectedDate.getDate();
    
    return !consultantAppointments.some(appointment => {
      // Handle appointment date in new object format
      const appDate = appointment.appointmentDate;
      
      // Check if the date matches (year, month, day) and the slot is the same
      return appDate.year === selectedYear && 
             appDate.month === selectedMonth && 
             appDate.day === selectedDay && 
             appointment.slot === slotValue;
    });
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.appointmentDate || !bookingData.slot || 
        !bookingData.customerName || !bookingData.customerPhone || 
        !bookingData.customerEmail) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Check if selected time is available
    if (!isSlotAvailable(bookingData.appointmentDate, parseInt(bookingData.slot))) {
      toast.error('Khung giờ đã chọn không có sẵn!');
      return;
    }

    try {
      const selectedDate = new Date(bookingData.appointmentDate);
      
      // Create appointment using the required format
      const appointmentData = {
        userId: localStorage.getItem('userId') || "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Get from auth or use placeholder
        consultantId: selectedConsultant.consultant_id,
        appointmentDate: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1, // JavaScript months are 0-indexed
          day: selectedDate.getDate(),
          dayOfWeek: selectedDate.getDay()
        },
        slot: parseInt(bookingData.slot)
      };

      await createAppointmentAPI(appointmentData);
      toast.success('Đặt lịch tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      
      // Refresh appointments for this consultant
      await fetchConsultantAppointments(selectedConsultant.consultant_id);
      
      // Reset form and close modal
      setBookingData({
        appointmentDate: '',
        slot: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        notes: ''
      });
      setShowBookingModal(false);
      setSelectedConsultant(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
      console.error(error);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Get slot label from value
  const getSlotLabel = (slotValue) => {
    const slot = FIXED_SLOTS.find(s => s.value === slotValue);
    return slot ? slot.label : '';
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
                {FIXED_SLOTS.map(slot => (
                  <span key={slot.id} className={styles.timeSlot}>
                    {slot.label}
                  </span>
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
                <label>Khung giờ *</label>
                <select
                  name="slot"
                  value={bookingData.slot}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Chọn khung giờ</option>
                  {FIXED_SLOTS.map(slot => (
                    <option 
                      key={slot.id} 
                      value={slot.value}
                      disabled={bookingData.appointmentDate && !isSlotAvailable(bookingData.appointmentDate, slot.value)}
                    >
                      {slot.label} {bookingData.appointmentDate && !isSlotAvailable(bookingData.appointmentDate, slot.value) ? '(Đã đặt)' : ''}
                    </option>
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
                {bookingData.appointmentDate && bookingData.slot && (
                  <p>Thời gian: {new Date(bookingData.appointmentDate).toLocaleDateString('vi-VN')} {getSlotLabel(parseInt(bookingData.slot))}</p>
                )}
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
