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
        console.log('Consultant API response:', response);
        
        // Handle different response structures
        let consultantArray = [];
        
        if (response && response.data) {
          // Check if response.data is an array
          if (Array.isArray(response.data)) {
            consultantArray = response.data;
          } 
          // Check if response.data has $values array (common in .NET responses)
          else if (response.data.$values && Array.isArray(response.data.$values)) {
            consultantArray = response.data.$values;
          }
          // Check if response.data is a single object
          else if (typeof response.data === 'object' && response.data.userId) {
            consultantArray = [response.data];
          }
          // Log what we found
          console.log('Extracted consultant array:', consultantArray);
          
          const consultantData = consultantArray.map((consultant) => ({
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
      console.log(`Appointments response for consultant ${consultantId}:`, response);

      let appointmentArray = [];

      if (response && response.data) {
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          appointmentArray = response.data;
        } 
        // Check if response.data has $values array (common in .NET responses)
        else if (response.data.$values && Array.isArray(response.data.$values)) {
          appointmentArray = response.data.$values;
        }
        // Check if response.data is a single object
        else if (typeof response.data === 'object' && response.data.id) {
          appointmentArray = [response.data];
        }
        
        console.log(`Extracted appointments for consultant ${consultantId}:`, appointmentArray);
        setBookedAppointments((prev) => ({
          ...prev,
          [consultantId]: appointmentArray,
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
      toast.error('Please login to book a consultation!');
      return;
    }

    // Validation
    if (!bookingData.appointmentDate || !bookingData.slot) {
      toast.error('Please select a date and time slot for consultation!');
      return;
    }

    // Check if selected time is available
    if (!isSlotAvailable(bookingData.appointmentDate, parseInt(bookingData.slot))) {
      toast.error('The selected time slot is not available!');
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
      toast.success('Consultation booked successfully!');

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
      toast.error('An error occurred while booking. Please try again!');
      console.error(error);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
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
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      <div className={styles.header}>
        <h1>Book a Consultation</h1>
        <p>Choose an expert that suits your needs</p>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for experts..."
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
            <option value="">All specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
            <option value="name">Sort by name</option>
            <option value="rating">Sort by rating</option>
            <option value="price">Sort by price</option>
            <option value="experience">Sort by experience</option>
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
              <div className={styles.price}>{formatPrice(consultant.price)}/session</div>
            </div>

            <div className={styles.availability}>
              <p>
                <strong>Available time slots:</strong>
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
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className={styles.noResults}>
          <p>No matching experts found</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedConsultant && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Book with {selectedConsultant.name}</h2>
              <button className={styles.closeButton} onClick={() => setShowBookingModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
              {!userInfo ? (
                <div className={styles.authWarning}>
                  <p>Please login to book a consultation.</p>
                </div>
              ) : (
                <>
                  <div className={styles.userInfo}>
                    <h3>Booking Information:</h3>
                    <p>
                      <strong>Name:</strong> {userInfo.fullName || userInfo.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {userInfo.phoneNumber || 'Not provided'}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Appointment Date *</label>
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
                    <label>Time Slot *</label>
                    <select name="slot" value={bookingData.slot} onChange={handleBookingChange} required>
                      <option value="">Select a time slot</option>
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
                        0 && <p className={styles.noSlots}>No available slots for this day</p>}
                  </div>

                  <div className={styles.bookingSummary}>
                    <p>
                      <strong>Booking Summary:</strong>
                    </p>
                    <p>Expert: {selectedConsultant.name}</p>
                    <p>Specialization: {selectedConsultant.specialization}</p>
                    <p>Fee: {formatPrice(selectedConsultant.price)}</p>
                    {bookingData.appointmentDate && bookingData.slot && (
                      <p>
                        Time: {new Date(bookingData.appointmentDate).toLocaleDateString('en-US')}{' '}
                        {getSlotLabel(parseInt(bookingData.slot))}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton} disabled={!userInfo}>
                  Confirm Booking
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
