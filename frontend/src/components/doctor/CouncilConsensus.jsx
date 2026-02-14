import { Box, Typography, LinearProgress, Chip, Paper } from '@mui/material';

export default function CouncilConsensus({ consensus, dissenting }) {
  const pct = Math.round((consensus || 0) * 100);
  const color = pct >= 80 ? '#388E3C' : pct >= 60 ? '#F57C00' : '#D32F2F';

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>Council Consensus</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate" value={pct}
            sx={{ height: 10, borderRadius: 5, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 5 } }}
          />
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ color }}>{pct}%</Typography>
      </Box>
      {dissenting && dissenting.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>Dissenting views:</Typography>
          {dissenting.map((d, i) => (
            <Chip key={i} label={d} size="small" variant="outlined" sx={{ mt: 0.5, mr: 0.5 }} />
          ))}
        </Box>
      )}
    </Paper>
  );
}
