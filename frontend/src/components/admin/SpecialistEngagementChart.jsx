import { Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SpecialistEngagementChart({ data }) {
  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="specialist" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip formatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Bar dataKey="avgRelevance" fill="#00897B" radius={[4, 4, 0, 0]} name="Avg Relevance" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
