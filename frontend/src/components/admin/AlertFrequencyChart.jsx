import { Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AlertFrequencyChart({ data }) {
  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="critical" stackId="a" fill="#D32F2F" />
          <Bar dataKey="warning" stackId="a" fill="#F57C00" />
          <Bar dataKey="info" stackId="a" fill="#1A73E8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
