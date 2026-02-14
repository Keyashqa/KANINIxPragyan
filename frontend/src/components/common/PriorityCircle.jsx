import { Box, CircularProgress, Typography } from '@mui/material';

function getColor(score) {
  if (score >= 80) return '#D32F2F';
  if (score >= 60) return '#F57C00';
  if (score >= 40) return '#FBC02D';
  return '#388E3C';
}

export default function PriorityCircle({ score, size = 64 }) {
  const color = getColor(score);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={size}
        thickness={5}
        sx={{ color, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
      />
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={5}
        sx={{ color: '#E0E0E0', position: 'absolute', left: 0 }}
      />
      <CircularProgress
        variant="determinate"
        value={score}
        size={size}
        thickness={5}
        sx={{ color, position: 'absolute', left: 0 }}
      />
      <Box sx={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography variant="caption" fontWeight={700} sx={{ color, fontSize: size * 0.22 }}>
          {score}
        </Typography>
      </Box>
    </Box>
  );
}
