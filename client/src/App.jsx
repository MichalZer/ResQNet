import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import CityPage from './pages/CityPage';
import BuildingPage from './pages/BuildingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/city/:cityId" element={<CityPage />} />
        <Route path="/city/:cityId/building/:buildingId" element={<BuildingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

