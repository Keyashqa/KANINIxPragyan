import { Box, Typography, LinearProgress, Chip, Paper } from '@mui/material';

export default function CouncilConsensus({ consensus, dissenting }) {
  // If consensus is a number, format it. If string, display as is.
  const isNumber = typeof consensus === 'number';
  const display = isNumber ? `${Math.round(consensus * 100)}%` : consensus;
  const color = isNumber && consensus >= 0.8 ? '#388E3C' : '#1A73E8';

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>Council Consensus</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        {isNumber && (
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate" value={consensus * 100}
              sx={{ height: 10, borderRadius: 5, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 5 } }}
            />
          </Box>
        )}
        <Typography variant="h6" fontWeight={700} sx={{ color }}>{display}</Typography>
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
