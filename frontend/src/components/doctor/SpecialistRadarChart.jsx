import { Box, Typography } from '@mui/material';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SpecialistRadarChart({ opinions }) {
  if (!opinions || opinions.length === 0) return null;

  const data = opinions.map((op) => ({
    specialty: op.specialty.replace(' Medicine', ''),
    relevance: Math.round(op.relevance_score * 100),
    urgency: Math.round(op.urgency_score * 100),
  }));

  return (
    <Box sx={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#E0E0E0" />
          <PolarAngleAxis dataKey="specialty" tick={{ fontSize: 12, fill: '#555' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar name="Relevance" dataKey="relevance" stroke="#1A73E8" fill="#1A73E8" fillOpacity={0.2} strokeWidth={2} />
          <Radar name="Urgency" dataKey="urgency" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.15} strokeWidth={2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}
