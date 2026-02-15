import { Alert, Stack, Typography } from '@mui/material';
import { Warning, Error as ErrorIcon } from '@mui/icons-material';

export default function SafetyAlerts({ alerts = [] }) {
  if (!alerts.length) return null;

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Typography variant="subtitle2">Safety Alerts</Typography>
      {alerts.map((a, i) => (
        <Alert
          key={i}
          severity={a.severity === 'CRITICAL' ? 'error' : 'warning'}
          icon={a.severity === 'CRITICAL' ? <ErrorIcon /> : <Warning />}
          sx={{
            fontWeight: 600,
            ...(a.severity === 'CRITICAL' && { animation: 'pulse-critical 1.5s infinite' }),
          }}
        >
          <strong>[{a.source}]</strong> {a.label}
          {a.pattern && <Typography variant="caption" display="block">{a.pattern}</Typography>}
        </Alert>
      ))}
    </Stack>
  );
}
