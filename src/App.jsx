import { Route, Routes } from 'react-router-dom';
import { publicRouters } from '~/routes/routes';

function App() {
  return (
    <>
      <Routes>
        {publicRouters.map((route, index) => {
          return <Route key={index} path={route.path} element={route.component} />;
        })}
      </Routes>
    </>
  );
}

export default App;
