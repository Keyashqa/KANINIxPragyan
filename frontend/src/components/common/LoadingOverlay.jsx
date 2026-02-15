import { Backdrop, CircularProgress, Typography, Stack } from '@mui/material';

export default function LoadingOverlay({ open, message = 'Loading...' }) {
  return (
    <Backdrop open={open} sx={{ zIndex: 1400, color: '#fff', flexDirection: 'column' }}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress color="inherit" size={48} />
        <Typography variant="h6">{message}</Typography>
      </Stack>
    </Backdrop>
  );
}
