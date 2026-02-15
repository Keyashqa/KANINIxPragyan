import { Box, Chip, Typography, Stack } from '@mui/material';

export default function ConsensusBar({ consensus, dissenting = [] }) {
  const color = consensus === 'Unanimous' ? 'success' : consensus === 'Split' ? 'error' : 'warning';

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2">Council Consensus:</Typography>
        <Chip label={consensus} color={color} />
      </Stack>
      {dissenting.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {dissenting.map((d, i) => (
            <Typography key={i} variant="body2" color="text.secondary">
              {d.specialty} dissents — recommends {d.recommended} (relevance: {d.relevance_score})
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
