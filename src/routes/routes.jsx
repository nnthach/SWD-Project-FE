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
];

export const privateRouters = [];
