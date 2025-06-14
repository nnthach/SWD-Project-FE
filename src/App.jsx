import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '~/context/AuthContext';
import { publicRouters } from '~/routes/routes';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {publicRouters.map((route, index) => {
          return <Route key={index} path={route.path} element={route.component} />;
        })}
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
