import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import SendIcon from '@mui/icons-material/Send';
import { getStats } from '../../services/api';
import { useTriage } from '../../context/TriageContext';
import RiskBadge from '../common/RiskBadge';
import RiskDistributionChart from './RiskDistributionChart';
import DepartmentLoadChart from './DepartmentLoadChart';
import DailyTrendChart from './DailyTrendChart';
import AlertFrequencyChart from './AlertFrequencyChart';
import SpecialistEngagementChart from './SpecialistEngagementChart';

function StatCard({ icon, label, value, color }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color, display: 'flex' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const { patientQueue } = useTriage();

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return null;

  const logColumns = [
    { field: 'patient_name', headerName: 'Patient', flex: 1, minWidth: 130 },
    { field: 'age', headerName: 'Age', width: 70 },
    {
      field: 'final_risk_level', headerName: 'Risk', width: 110,
      renderCell: (params) => <RiskBadge level={params.value} size="small" />,
    },
    { field: 'primary_department', headerName: 'Department', width: 150 },
    { field: 'priority_score', headerName: 'Priority', width: 80 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <DashboardIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>Analytics Dashboard</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<PeopleIcon />} label="Total Patients Today" value={stats.totalPatientsToday} color="#1A73E8" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<WarningIcon />} label="High/Critical" value={stats.highCriticalCount} color="#D32F2F" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<SpeedIcon />} label="Avg Priority Score" value={stats.avgPriorityScore} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<SendIcon />} label="Referrals Made" value={stats.referralsMade} color="#00897B" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Risk Distribution</Typography>
              <RiskDistributionChart data={stats.riskDistribution} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Department Load</Typography>
              <DepartmentLoadChart data={stats.departmentLoad} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Daily Trend</Typography>
              <DailyTrendChart data={stats.dailyTrend} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Alert Frequency</Typography>
              <AlertFrequencyChart data={stats.alertFrequency} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Specialist Engagement</Typography>
              <SpecialistEngagementChart data={stats.specialistEngagement} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Patient Log</Typography>
          <DataGrid
            rows={patientQueue}
            columns={logColumns}
            getRowId={(row) => row.patient_id}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
