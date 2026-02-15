import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import TriagePage from './pages/TriagePage';
import ResultPage from './pages/ResultPage';
import CouncilPage from './pages/CouncilPage';
import QueuePage from './pages/QueuePage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<TriagePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/council" element={<CouncilPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
