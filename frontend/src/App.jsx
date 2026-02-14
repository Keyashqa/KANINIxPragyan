import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import NursePage from './pages/NursePage';
import NurseTriagePage from './pages/NurseTriagePage';
import NurseResultPage from './pages/NurseResultPage';
import DoctorPage from './pages/DoctorPage';
import DoctorCasePage from './pages/DoctorCasePage';
import DoctorAlertsPage from './pages/DoctorAlertsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/nurse" replace />} />
        <Route path="/nurse" element={<NursePage />} />
        <Route path="/nurse/triage" element={<NurseTriagePage />} />
        <Route path="/nurse/result" element={<NurseResultPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/doctor/case/:id" element={<DoctorCasePage />} />
        <Route path="/doctor/alerts" element={<DoctorAlertsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
