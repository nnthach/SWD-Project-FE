import { useState, useEffect, useContext } from 'react';
import { useConsultant } from '~/context/ConsultantContext';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import styles from './BookConsultant.module.scss';
import * as staffConsultantService from '~/services/staffConsultantService';
import { getAllAppointmentAPI, createAppointmentAPI } from '~/services/appointmentService';

// Define fixed time slots
const FIXED_SLOTS = [
  { id: 1, label: '7:00 - 9:00', value: 1 },
  { id: 2, label: '9:00 - 11:00', value: 2 },
  { id: 3, label: '13:00 - 15:00', value: 3 },
  { id: 4, label: '15:00 - 17:00', value: 4 },
];

function BookConsultant() {
  const { searchTerm, setSearchTerm, filters, setFilters, sortBy, setSortBy, clearError } = useConsultant();
  const { userInfo, userId } = useContext(AuthContext);

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
    notes: '',
  });

  // Fetch consultants
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await staffConsultantService.getAllStaffConsultantAPI('157f0b62-afbb-44ce-91ce-397239875df5');

        if (response && response.data) {
          const consultantData = response.data.map((consultant) => ({
            consultant_id: consultant.userId,
            name: consultant.fullName || consultant.username,
            email: consultant.email,
            phone: consultant.phoneNumber,
            specialization: 'Consultant', // Default value or fetch from another API if needed
            experience: 'Experience', // Placeholder
            rating: 5, // Placeholder
            price: 300000, // Placeholder
            description: 'Professional consultant', // Placeholder
            avatar: 'https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png', // Placeholder
          }));

          setConsultants(consultantData);
          setFilteredConsultants(consultantData);

          // Extract unique specializations
          const specs = [...new Set(consultantData.map((c) => c.specialization))];
          setSpecializations(specs);

          // Fetch booked appointments for each consultant
          consultantData.forEach(async (consultant) => {
            await fetchConsultantAppointments(consultant.consultant_id);
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load consultants');
        toast.error('Failed to load consultants');
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
        setBookedAppointments((prev) => ({
          ...prev,
          [consultantId]: response.data,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch appointments for consultant', consultantId, err);
    }
  };

  // Filter consultants when search or filters change
  useEffect(() => {
    let filtered = [...consultants];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter((c) => c.specialization === filters.specialization);
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
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if a slot is available for a specific date
  const isSlotAvailable = (date, slotValue) => {
    if (!selectedConsultant || !bookedAppointments[selectedConsultant.consultant_id]) {
      return true;
    }

    const consultantAppointments = bookedAppointments[selectedConsultant.consultant_id];

    // Format the selected date to YYYY-MM-DD for comparison
    const selectedDate = new Date(date);
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0]; // Creates YYYY-MM-DD format

    return !consultantAppointments.some((appointment) => {
      // API returns appointmentDate as string in YYYY-MM-DD format
      const appointmentDateStr = appointment.appointmentDate;

      // Compare the date strings and slot values
      return appointmentDateStr === formattedSelectedDate && appointment.slot === parseInt(slotValue);
    });
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error('Vui lòng đăng nhập để đặt lịch tư vấn!');
      return;
    }

    // Validation
    if (!bookingData.appointmentDate || !bookingData.slot) {
      toast.error('Vui lòng chọn ngày và khung giờ tư vấn!');
      return;
    }

    // Check if selected time is available
    if (!isSlotAvailable(bookingData.appointmentDate, parseInt(bookingData.slot))) {
      toast.error('Khung giờ đã chọn không có sẵn!');
      return;
    }

    try {
      // Format date as YYYY-MM-DD string
      const selectedDate = new Date(bookingData.appointmentDate);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Creates YYYY-MM-DD format

      // Create appointment using user info from AuthContext
      const appointmentData = {
        userId: userId,
        consultantId: selectedConsultant.consultant_id,
        appointmentDate: formattedDate, // Send as YYYY-MM-DD string
        slot: parseInt(bookingData.slot),
      };

      console.log('Creating appointment with data:', appointmentData);

      await createAppointmentAPI(appointmentData);
      toast.success('Đặt lịch tư vấn thành công!');

      // Refresh appointments for this consultant
      await fetchConsultantAppointments(selectedConsultant.consultant_id);

      // Reset form and close modal
      setBookingData({
        appointmentDate: '',
        slot: '',
        notes: '',
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
      currency: 'VND',
    }).format(price);
  };

  // Get slot label from value
  const getSlotLabel = (slotValue) => {
    const slot = FIXED_SLOTS.find((s) => s.value === slotValue);
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
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
            <option value="name">Sắp xếp theo tên</option>
            <option value="rating">Sắp xếp theo đánh giá</option>
            <option value="price">Sắp xếp theo giá</option>
            <option value="experience">Sắp xếp theo kinh nghiệm</option>
          </select>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className={styles.consultantsGrid}>
        {filteredConsultants.map((consultant) => (
          <div key={consultant.consultant_id} className={styles.consultantCard}>
            <div className={styles.consultantHeader}>
              <img src={consultant.avatar} alt={consultant.name} className={styles.avatar} />
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
              <p>
                <strong>Khung giờ có sẵn:</strong>
              </p>
              <div className={styles.timeSlots}>
                {FIXED_SLOTS.map((slot) => (
                  <span key={slot.id} className={styles.timeSlot}>
                    {slot.label}
                  </span>
                ))}
              </div>
            </div>

            <button className={styles.bookButton} onClick={() => handleSelectConsultant(consultant)}>
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
              <button className={styles.closeButton} onClick={() => setShowBookingModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
              {!userInfo ? (
                <div className={styles.authWarning}>
                  <p>Vui lòng đăng nhập để đặt lịch tư vấn.</p>
                </div>
              ) : (
                <>
                  <div className={styles.userInfo}>
                    <h3>Thông tin người đặt lịch:</h3>
                    <p>
                      <strong>Họ tên:</strong> {userInfo.fullName || userInfo.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {userInfo.phoneNumber || 'Chưa cập nhật'}
                    </p>
                  </div>

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
                    <select name="slot" value={bookingData.slot} onChange={handleBookingChange} required>
                      <option value="">Chọn khung giờ</option>
                      {bookingData.appointmentDate
                        ? // Filter slots to only show available ones
                          FIXED_SLOTS.filter((slot) => isSlotAvailable(bookingData.appointmentDate, slot.value)).map(
                            (slot) => (
                              <option key={slot.id} value={slot.value}>
                                {slot.label}
                              </option>
                            ),
                          )
                        : // When no date selected, show all slots but disabled
                          FIXED_SLOTS.map((slot) => (
                            <option key={slot.id} value={slot.value} disabled>
                              {slot.label}
                            </option>
                          ))}
                    </select>
                    {bookingData.appointmentDate &&
                      FIXED_SLOTS.filter((slot) => isSlotAvailable(bookingData.appointmentDate, slot.value)).length ===
                        0 && <p className={styles.noSlots}>Không có khung giờ trống cho ngày này</p>}
                  </div>

                  <div className={styles.bookingSummary}>
                    <p>
                      <strong>Tóm tắt đặt lịch:</strong>
                    </p>
                    <p>Chuyên gia: {selectedConsultant.name}</p>
                    <p>Chuyên ngành: {selectedConsultant.specialization}</p>
                    <p>Chi phí: {formatPrice(selectedConsultant.price)}</p>
                    {bookingData.appointmentDate && bookingData.slot && (
                      <p>
                        Thời gian: {new Date(bookingData.appointmentDate).toLocaleDateString('vi-VN')}{' '}
                        {getSlotLabel(parseInt(bookingData.slot))}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>
                  Hủy
                </button>
                <button type="submit" className={styles.submitButton} disabled={!userInfo}>
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
