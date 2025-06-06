import Admin from '~/pages/Admin/Admin';
import Auth from '~/pages/Auth/Auth';
import Home from '~/pages/Home/Home';
import Service from '~/pages/Service/Service';

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
    path: '/auth/:type',
    component: <Auth />,
  },
  {
    path: '/admin',
    component: <Admin />,
  },
];

export const privateRouters = [];
