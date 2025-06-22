import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { fakeConsultants, fakeAppointments } from '~/constants/fakeData';
import consultantService from '~/services/consultantService';

// Initial state
const initialState = {
  consultants: [],
  appointments: [],
  selectedConsultant: null,
  loading: false,
  error: null,
  filters: {
    specialization: '',
    minRating: 0,
    maxPrice: Infinity,
    availableOnly: true
  },
  searchTerm: '',
  sortBy: 'name'
};

// Action types
const CONSULTANT_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONSULTANTS: 'SET_CONSULTANTS',
  SET_APPOINTMENTS: 'SET_APPOINTMENTS',
  SET_SELECTED_CONSULTANT: 'SET_SELECTED_CONSULTANT',
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  SET_FILTERS: 'SET_FILTERS',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SORT_BY: 'SET_SORT_BY',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const consultantReducer = (state, action) => {
  switch (action.type) {
    case CONSULTANT_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case CONSULTANT_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case CONSULTANT_ACTION_TYPES.SET_CONSULTANTS:
      return {
        ...state,
        consultants: action.payload,
        loading: false,
        error: null
      };
    
    case CONSULTANT_ACTION_TYPES.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
        loading: false,
        error: null
      };
    
    case CONSULTANT_ACTION_TYPES.SET_SELECTED_CONSULTANT:
      return {
        ...state,
        selectedConsultant: action.payload
      };
    
    case CONSULTANT_ACTION_TYPES.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [...state.appointments, action.payload]
      };
    
    case CONSULTANT_ACTION_TYPES.UPDATE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.appointment_id === action.payload.appointment_id
            ? { ...appointment, ...action.payload }
            : appointment
        )
      };
    
    case CONSULTANT_ACTION_TYPES.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case CONSULTANT_ACTION_TYPES.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    
    case CONSULTANT_ACTION_TYPES.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };
    
    case CONSULTANT_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const ConsultantContext = createContext();

// Context provider component
export const ConsultantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(consultantReducer, initialState);

  // Load consultants data
  const loadConsultants = async () => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_LOADING, payload: true });
    try {
      // In real app, this would be an API call
      // const consultants = await consultantService.getAllConsultants();
      const consultants = fakeConsultants;
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_CONSULTANTS, payload: consultants });
    } catch (error) {
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Load appointments data
  const loadAppointments = async (userId = null) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_LOADING, payload: true });
    try {
      // In real app, this would be an API call
      // const appointments = userId 
      //   ? await consultantService.getUserAppointments(userId)
      //   : await consultantService.getAllAppointments();
      const appointments = fakeAppointments;
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_APPOINTMENTS, payload: appointments });
    } catch (error) {
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_LOADING, payload: true });
    try {
      // In real app, this would be an API call
      // const newAppointment = await consultantService.createAppointment(appointmentData);
      const newAppointment = {
        ...appointmentData,
        appointment_id: Math.random().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: CONSULTANT_ACTION_TYPES.ADD_APPOINTMENT, payload: newAppointment });
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_LOADING, payload: false });
      return newAppointment;
    } catch (error) {
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update appointment
  const updateAppointment = async (appointmentId, updateData) => {
    try {
      // In real app, this would be an API call
      // const updatedAppointment = await consultantService.updateAppointment(appointmentId, updateData);
      const updatedAppointment = { appointment_id: appointmentId, ...updateData };
      
      dispatch({ type: CONSULTANT_ACTION_TYPES.UPDATE_APPOINTMENT, payload: updatedAppointment });
      return updatedAppointment;
    } catch (error) {
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      await updateAppointment(appointmentId, { status: 'cancelled' });
    } catch (error) {
      throw error;
    }
  };

  // Filter and sort consultants
  const getFilteredConsultants = () => {
    let filtered = state.consultants;

    // Apply search filter
    if (state.searchTerm) {
      filtered = filtered.filter(consultant =>
        consultant.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        consultant.specialization.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        consultant.description.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    // Apply filters
    filtered = filtered.filter(consultant => {
      return (
        (!state.filters.specialization || consultant.specialization === state.filters.specialization) &&
        consultant.rating >= state.filters.minRating &&
        consultant.price <= state.filters.maxPrice &&
        (!state.filters.availableOnly || consultant.isAvailable)
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  // Get unique specializations
  const getSpecializations = () => {
    return [...new Set(state.consultants.map(c => c.specialization))];
  };  // Load initial data with stable function references
  useEffect(() => {
    const initializeData = async () => {
      dispatch({ type: CONSULTANT_ACTION_TYPES.SET_LOADING, payload: true });
      try {
        // Load consultants
        const consultants = fakeConsultants;
        dispatch({ type: CONSULTANT_ACTION_TYPES.SET_CONSULTANTS, payload: consultants });
        
        // Load appointments
        const appointments = fakeAppointments;
        dispatch({ type: CONSULTANT_ACTION_TYPES.SET_APPOINTMENTS, payload: appointments });
      } catch (error) {
        dispatch({ type: CONSULTANT_ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    };

    initializeData();
  }, []); // Empty dependency array for initial load only

  // Memoize the action functions to prevent infinite re-renders
  const setFilters = useMemo(() => (filters) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_FILTERS, payload: filters });
  }, []);

  const setSearchTerm = useMemo(() => (term) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_SEARCH_TERM, payload: term });
  }, []);

  const setSortBy = useMemo(() => (sortBy) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_SORT_BY, payload: sortBy });
  }, []);

  const setSelectedConsultant = useMemo(() => (consultant) => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.SET_SELECTED_CONSULTANT, payload: consultant });
  }, []);

  const clearError = useMemo(() => () => {
    dispatch({ type: CONSULTANT_ACTION_TYPES.CLEAR_ERROR });
  }, []);

  // Memoize computed values to prevent infinite render loops
  const filteredConsultants = useMemo(() => getFilteredConsultants(), [
    state.consultants, 
    state.searchTerm, 
    state.filters.specialization,
    state.filters.minRating,
    state.filters.maxPrice,
    state.filters.availableOnly,
    state.sortBy
  ]);

  const specializations = useMemo(() => getSpecializations(), [state.consultants]);
  // Memoize the async functions to prevent infinite re-renders
  const loadConsultantsCallback = useMemo(() => loadConsultants, []);
  const loadAppointmentsCallback = useMemo(() => loadAppointments, []);
  const createAppointmentCallback = useMemo(() => createAppointment, []);
  const updateAppointmentCallback = useMemo(() => updateAppointment, []);
  const cancelAppointmentCallback = useMemo(() => cancelAppointment, []);

  // Memoize the value object to prevent context consumers from re-rendering unnecessarily
  const value = useMemo(() => ({
    // State
    ...state,
    
    // Computed values - now memoized
    filteredConsultants,
    specializations,
    
    // Actions
    loadConsultants: loadConsultantsCallback,
    loadAppointments: loadAppointmentsCallback,
    createAppointment: createAppointmentCallback,
    updateAppointment: updateAppointmentCallback,
    cancelAppointment: cancelAppointmentCallback,
    setFilters,
    setSearchTerm,
    setSortBy,
    setSelectedConsultant,
    clearError
  }), [
    state,
    filteredConsultants,
    specializations,
    loadConsultantsCallback,
    loadAppointmentsCallback,
    createAppointmentCallback,
    updateAppointmentCallback,
    cancelAppointmentCallback,
    setFilters,
    setSearchTerm,
    setSortBy,
    setSelectedConsultant,
    clearError
  ]);

  return (
    <ConsultantContext.Provider value={value}>
      {children}
    </ConsultantContext.Provider>
  );
};

// Custom hook to use the consultant context
export const useConsultant = () => {
  const context = useContext(ConsultantContext);
  if (!context) {
    throw new Error('useConsultant must be used within a ConsultantProvider');
  }
  return context;
};

export default ConsultantContext;
