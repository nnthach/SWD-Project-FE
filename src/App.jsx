import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '~/context/AuthContext';
import { ServiceProvider } from '~/context/ServiceContext';
import { publicRouters } from '~/routes/routes';

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <Routes>
          {publicRouters.map((route, index) => {
            return <Route key={index} path={route.path} element={route.component} />;
          })}
        </Routes>
        <ToastContainer />
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;
