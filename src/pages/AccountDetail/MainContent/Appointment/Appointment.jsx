import { useState, useEffect, useContext } from 'react';
import { getAllAppointmentAPI, deleteAppointmentAPI } from '~/services/appointmentService';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import styles from './Appointment.module.scss';

// Define fixed time slots
const TIME_SLOTS = {
  1: '7:00 - 9:00',
  2: '9:00 - 11:00',
  3: '13:00 - 15:00',
  4: '15:00 - 17:00',
};

// Consultant role ID
const CONSULTANT_ROLE_ID = "157f0b62-afbb-44ce-91ce-397239875df5";

function Appointment() {
  const { userId, userInfo } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isConsultant = userInfo && userInfo.roleId === CONSULTANT_ROLE_ID;

  // Fetch appointments for the current user
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Different parameter based on role
        const paramKey = isConsultant ? 'consultantId' : 'customerId';
        const params = new URLSearchParams({ [paramKey]: userId }).toString();
        
        console.log(`Fetching appointments as ${isConsultant ? 'consultant' : 'customer'} with params:`, params);
        
        const response = await getAllAppointmentAPI(params);
        console.log('Appointments response:', response);
        
        let appointmentData = [];
        
        // Process response data based on .NET API format with $values
        if (response && response.data) {
          // Check specifically for $values array (primary format from sample)
          if (response.data.$values && Array.isArray(response.data.$values)) {
            appointmentData = response.data.$values;
            console.log('Found appointments in $values array:', appointmentData);
          } 
          // Fallback to other formats
          else if (Array.isArray(response.data)) {
            appointmentData = response.data;
          } else if (typeof response.data === 'object') {
            // Single appointment object
            appointmentData = [response.data];
          }
        }
        
        setAppointments(appointmentData);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load your appointments. Please try again later.');
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [userId, userInfo, isConsultant]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Get time slot label
  const getTimeSlot = (slotNumber) => {
    return TIME_SLOTS[slotNumber] || 'Unknown time';
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteAppointmentAPI(appointmentId);
      
      // Remove the cancelled appointment from state
      setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
      
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      toast.error('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  // Determine appointment status based on API status field and date
  const getAppointmentStatus = (appointment) => {
    // Use the status directly from API if available
    if (appointment.status) {
      switch(appointment.status) {
        case 'Cancelled':
          return { text: 'Cancelled', className: styles.cancelled };
        case 'Completed':
          return { text: 'Completed', className: styles.completed };
        case 'Pending':
          return { text: 'Upcoming', className: styles.upcoming };
        default:
          break;
      }
    }
    
    // Fallback to date-based logic if status field is unavailable or unrecognized
    const today = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    
    // If date has passed
    if (appointmentDate < today) {
      return { text: 'Completed', className: styles.completed };
    }
    
    return { text: 'Upcoming', className: styles.upcoming };
  };
  
  // Open meeting URL
  const openMeetingUrl = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.info('Meeting link is not available yet');
    }
  };

  return (
    <div className={styles.appointmentContainer}>
      <h2>{isConsultant ? 'My Consultation Sessions' : 'My Appointments'}</h2>
      
      {loading && <div className={styles.loading}>Loading appointments...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {!loading && !error && appointments.length === 0 && (
        <div className={styles.noAppointments}>
          <p>{isConsultant ? 'You have no scheduled consultation sessions.' : 'You have no appointments scheduled.'}</p>
        </div>
      )}
      
      {appointments.length > 0 && (
        <div className={styles.appointmentList}>
          <div className={styles.appointmentHeader}>
            <span className={styles.date}>Date</span>
            <span className={styles.time}>Time</span>
            <span className={styles.consultant}>{isConsultant ? 'Client' : 'Consultant'}</span>
            <span className={styles.status}>Status</span>
            <span className={styles.actions}>Actions</span>
          </div>
          
          {appointments.map(appointment => {
            const status = getAppointmentStatus(appointment);
            
            // Display different user based on role
            const displayName = isConsultant
              ? (appointment.user?.username || 'Unknown Client') 
              : (appointment.consultant?.username || 'Unknown Consultant');
            
            return (
              <div key={appointment.appointmentId} className={styles.appointmentItem}>
                <span className={styles.date}>{formatDate(appointment.appointmentDate)}</span>
                <span className={styles.time}>{getTimeSlot(appointment.slot)}</span>
                <span className={styles.consultant}>
                  {displayName}
                </span>
                <span className={`${styles.status} ${status.className}`}>
                  {status.text}
                </span>
                <span className={styles.actions}>
                  {status.text === 'Upcoming' && (
                    <>
                      {appointment.meetingUrl && (
                        <button 
                          className={styles.joinButton}
                          onClick={() => openMeetingUrl(appointment.meetingUrl)}
                        >
                          Join
                        </button>
                      )}
                      <button 
                        className={styles.cancelButton}
                        onClick={() => handleCancelAppointment(appointment.appointmentId)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Appointment;