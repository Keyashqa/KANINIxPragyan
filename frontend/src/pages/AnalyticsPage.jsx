import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack } from '@mui/material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line,
} from 'recharts';
import { getStats, getPatients } from '../api/triageApi';
import { RISK_COLORS } from '../utils/constants';

function StatCard({ label, value, color }) {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color, fontWeight: 700 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
    getPatients().then((d) => setPatients(d || [])).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography color="text.secondary">Loading analytics...</Typography>
      </Box>
    );
  }

  const riskPieData = Object.entries(stats.riskDistribution || {}).map(([name, value]) => ({
    name, value, color: RISK_COLORS[name] || '#9E9E9E',
  }));

  const deptBarData = Object.entries(stats.departmentLoad || {}).map(([name, value]) => ({ name, count: value }));

  const alertData = Object.entries(stats.alertFrequency || {}).map(([name, value]) => ({ name, count: value }));

  // Build trend data from patients
  const trendMap = {};
  patients.forEach((p) => {
    if (!p.timestamp) return;
    const day = new Date(p.timestamp).toLocaleDateString();
    if (!trendMap[day]) trendMap[day] = { day, Low: 0, Medium: 0, High: 0, Critical: 0 };
    const risk = p.verdict?.final_risk_level || 'Low';
    trendMap[day][risk] = (trendMap[day][risk] || 0) + 1;
  });
  const trendData = Object.values(trendMap);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Total Patients" value={stats.totalPatientsToday} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="High/Critical Cases" value={stats.highCriticalCount} color="#D32F2F" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Avg Priority Score" value={Math.round(stats.avgPriorityScore)} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Referrals Made" value={stats.referralsMade} color="#00897B" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Risk distribution pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Risk Distribution</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={riskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label>
                    {riskPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Department bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Department Load</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1565C0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Trend line */}
        {trendData.length > 0 && (
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Risk Trend Over Time</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Low" stroke={RISK_COLORS.Low} />
                    <Line type="monotone" dataKey="Medium" stroke={RISK_COLORS.Medium} />
                    <Line type="monotone" dataKey="High" stroke={RISK_COLORS.High} />
                    <Line type="monotone" dataKey="Critical" stroke={RISK_COLORS.Critical} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Alert frequency */}
        {alertData.length > 0 && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Alert Frequency</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={alertData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Recent patients log */}
      {patients.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Recent Patients</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #EEE' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Risk</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Department</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Priority</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[...patients].reverse().slice(0, 20).map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: 8 }}>{p.patient_data?.name || 'Unknown'}</td>
                      <td style={{ padding: 8 }}>{p.verdict?.final_risk_level || '-'}</td>
                      <td style={{ padding: 8 }}>{p.verdict?.primary_department || '-'}</td>
                      <td style={{ padding: 8 }}>{p.verdict?.priority_score || '-'}</td>
                      <td style={{ padding: 8 }}>{p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
