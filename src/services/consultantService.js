import axiosInstance from '~/config/axios';

class ConsultantService {
  // Get all consultants
  async getAllConsultants() {
    try {
      const response = await axiosInstance.get('/consultants');
      return response.data;
    } catch (error) {
      console.error('Error fetching consultants:', error);
      throw error;
    }
  }

  // Get consultant by ID
  async getConsultantById(consultantId) {
    try {
      const response = await axiosInstance.get(`/consultants/${consultantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching consultant:', error);
      throw error;
    }
  }

  // Get consultants by specialization
  async getConsultantsBySpecialization(specialization) {
    try {
      const response = await axiosInstance.get(`/consultants?specialization=${specialization}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching consultants by specialization:', error);
      throw error;
    }
  }

  // Get available time slots for a consultant on a specific date
  async getAvailableSlots(consultantId, date) {
    try {
      const response = await axiosInstance.get(`/consultants/${consultantId}/available-slots?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  // Create appointment
  async createAppointment(appointmentData) {
    try {
      const response = await axiosInstance.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  // Get user's appointments
  async getUserAppointments(userId) {
    try {
      const response = await axiosInstance.get(`/appointments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Cancel appointment
  async cancelAppointment(appointmentId) {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Get appointment by ID
  async getAppointmentById(appointmentId) {
    try {
      const response = await axiosInstance.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Search consultants
  async searchConsultants(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axiosInstance.get(`/consultants/search?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error searching consultants:', error);
      throw error;
    }
  }
}

export default new ConsultantService();
