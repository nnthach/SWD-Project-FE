import AccountDetail from '~/pages/AccountDetail/AccountDetail';
import Admin from '~/pages/Admin/Admin';
import Auth from '~/pages/Auth/Auth';
import ForgotPassword from '~/pages/Auth/ForgotPassword';
import ResetPassword from '~/pages/Auth/ResetPassword';
import Blog from '~/pages/Blog';
import BlogDetail from '~/pages/BlogDetail';
import BookConsultant from '~/pages/BookConsultant/BookConsultant';
import Home from '~/pages/Home/Home';
import Service from '~/pages/Service/Service';
import ServiceDetail from '~/pages/ServiceDetail/SerivceDetail';
import StaffSchedule from '~/pages/StaffSchedule/StaffSchedule';

export const publicRouters = [
  {
    path: '/',
    component: <Home />,
  },
  {
    path: '/service',
    component: <Service />,
  },
  {
    path: '/blog',
    component: <Blog />,
  },
  {
    path: '/blog/:id',
    component: <BlogDetail />,
  },
  {
    path: '/servicedetail/:id',
    component: <ServiceDetail />,
  },
  {
    path: '/book-consultant',
    component: <BookConsultant />,
  },
  {
    path: '/staff-schedule',
    component: <StaffSchedule />,
  },
  {
    path: '/auth/:type',
    component: <Auth />,
    layout: null,
  },
  {
    path: '/auth/forgot-password',
    component: <ForgotPassword />,
    layout: null,
  },
  {
    path: '/auth/reset-password',
    component: <ResetPassword />,
    layout: null,
  },
  {
    path: '/admin',
    component: <Admin />,
    layout: null,
  },
  {
    path: '/account/detail',
    component: <AccountDetail />,
  },
];

export const privateRouters = [];
