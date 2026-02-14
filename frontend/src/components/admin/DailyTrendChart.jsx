import { Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DailyTrendChart({ data }) {
  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="critical" stroke="#D32F2F" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="high" stroke="#F57C00" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="medium" stroke="#FBC02D" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
