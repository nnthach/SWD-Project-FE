# Consultant Booking Feature

## Overview
This feature allows customers to browse and book appointments with consultants based on their specializations and availability.

## Files Created/Modified

### 1. Fake Data (`src/constants/fakeData.js`)
- Added `fakeConsultants` array with consultant information
- Added `fakeAppointments` array with appointment data
- Added `availableTimeSlots` array for booking times

### 2. BookConsultant Page (`src/pages/BookConsultant/`)
- `BookConsultant.jsx` - Main component with booking functionality
- `BookConsultant.module.scss` - Styling for the booking interface
- `index.js` - Export file

### 3. Consultant Service (`src/services/consultantService.js`)
- API service methods for consultant and appointment operations
- Ready for backend integration

### 4. Consultant Context (`src/context/ConsultantContext.jsx`)
- State management for consultants and appointments
- Filtering, sorting, and search functionality
- CRUD operations for appointments

### 5. Routes (`src/routes/routes.jsx`)
- Added `/book-consultant` route

### 6. App Component (`src/App.jsx`)
- Added ConsultantProvider wrapper

### 7. Styles (`src/styles/main.scss`)
- Added react-toastify CSS import

## Features

### For Customers:
1. **Browse Consultants**: View all available consultants with their specializations
2. **Search & Filter**: Search by name and filter by specialization
3. **Sort Options**: Sort by name, rating, price, or experience
4. **View Details**: See consultant information, ratings, and available time slots
5. **Book Appointments**: Select date, time, and provide contact information
6. **Responsive Design**: Works on desktop and mobile devices

### Data Structure:

#### Consultant Object:
```javascript
{
  consultant_id: string,
  user_id: string,
  name: string,
  email: string,
  phone: string,
  specialization: string,
  experience: string,
  rating: number,
  avatar: string,
  description: string,
  availableSlots: string[],
  price: number,
  isAvailable: boolean
}
```

#### Appointment Object:
```javascript
{
  appointment_id: string,
  user_id: string,
  consultant_id: string,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  consultantName: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  status: string,
  notes: string,
  createdAt: string
}
```

## Usage

1. Navigate to `/book-consultant` in your application
2. Browse available consultants
3. Use search/filter to find specific consultants
4. Click "Đặt Lịch" (Book Appointment) on desired consultant
5. Fill in booking form with required information
6. Submit to create appointment

## Future Enhancements

1. Integration with backend API
2. User authentication for personalized bookings
3. Payment integration
4. Email/SMS notifications
5. Calendar integration
6. Video call scheduling
7. Appointment management for customers
8. Reviews and ratings system

## Technical Notes

- Uses React Context for state management
- Implements responsive design with SCSS modules
- Uses react-toastify for notifications
- Ready for backend API integration
- Follows component-based architecture
- Includes proper error handling and loading states
