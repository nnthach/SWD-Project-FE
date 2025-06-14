import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import { getAllServiceAPI } from '~/services/serviceService';

export const ServiceContext = createContext({});

export const ServiceProvider = ({ children }) => {
  const [servicesListData, setServicesListData] = useState([]);

  const fetchAllServices = async () => {
    try {
      const res = await getAllServiceAPI();
      console.log('get service res', res);
      setServicesListData(res.data);
    } catch (error) {
      console.log('fetch userInfo error', error);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  return <ServiceContext.Provider value={{ servicesListData, fetchAllServices }}>{children}</ServiceContext.Provider>;
};
