// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import generateRoutes from './routes/generateRoutes';


function App() {
  const routes = generateRoutes();

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;