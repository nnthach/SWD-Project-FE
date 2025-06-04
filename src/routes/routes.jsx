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
];

export const privateRouters = [];
