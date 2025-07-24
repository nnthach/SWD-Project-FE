import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { getUserInfoAPI, logoutAPI } from '~/services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState(Cookies.get('username'));
  const [userId, setUserId] = useState(null);

  const handleLogout = async () => {
    try {
      const res = await logoutAPI();
      console.log('res logout', res);

      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('username');
      setUserInfo(null);

      window.location.reload();
    } catch (error) {
      console.log('logout error', error);
    }
  };

  const fetchUserInfo = async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      return;
    }

    const decoded = jwtDecode(token);
    console.log('decode jwt', decoded);
    setUserId(decoded.nameid);

    try {
      const res = await getUserInfoAPI();
      setUserInfo(res.data);
    } catch (error) {
      console.log('fetch userInfo error', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [username]);

  return (
    <AuthContext.Provider
      value={{ userId, userInfo, setUserInfo, handleLogout, fetchUserInfo, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
