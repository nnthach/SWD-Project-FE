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
    path: '/auth/:type',
    component: <Auth />,
  },
  {
    path: '/auth/forgot-password',
    component: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password',
    component: <ResetPassword />,
  },
  {
    path: '/admin',
    component: <Admin />,
  },
  {
    path: '/account/detail',
    component: <AccountDetail />,
  },
];

export const privateRouters = [];
