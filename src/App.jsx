import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '~/context/AuthContext';
import { ServiceProvider } from '~/context/ServiceContext';
import { ConsultantProvider } from '~/context/ConsultantContext';
import { publicRouters } from '~/routes/routes';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Layout/components/Footer/Footer';
import Header from './components/Layout/components/Header/Header';

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <ConsultantProvider>
          <Header />
          <ScrollToTop />
          <Routes>
            {publicRouters.map((route, index) => {
              return <Route key={index} path={route.path} element={route.component} />;
            })}
          </Routes>
          <Footer />
          <ToastContainer />
        </ConsultantProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;
