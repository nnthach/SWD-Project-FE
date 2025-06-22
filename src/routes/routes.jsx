import AccountDetail from '~/pages/AccountDetail/AccountDetail';
import Admin from '~/pages/Admin/Admin';
import Auth from '~/pages/Auth/Auth';
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
    path: '/servicedetail/:id',
    component: <ServiceDetail />
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
    path: '/admin',
    component: <Admin />,
  },
  {
    path: '/account/detail',
    component: <AccountDetail />,
  },
];

export const privateRouters = [];
