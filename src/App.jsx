import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '~/context/AuthContext';
import { ServiceProvider } from '~/context/ServiceContext';
import { ConsultantProvider } from '~/context/ConsultantContext';
import { publicRouters } from '~/routes/routes';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <ConsultantProvider>
          <ScrollToTop />
          <Routes>
            {publicRouters.map((route, index) => {
              return <Route key={index} path={route.path} element={route.component} />;
            })}
          </Routes>
          <ToastContainer />
        </ConsultantProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;
