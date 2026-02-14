import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';

const styles = {
  CRITICAL: {
    bg: '#FFEBEE',
    border: '#D32F2F',
    icon: <ErrorIcon sx={{ color: '#D32F2F' }} />,
    animation: 'pulse 2s infinite',
  },
  WARNING: {
    bg: '#FFF8E1',
    border: '#F57C00',
    icon: <WarningAmberIcon sx={{ color: '#F57C00' }} />,
    animation: 'none',
  },
};

export default function SafetyAlertCard({ alert }) {
  const s = styles[alert.severity] || styles.WARNING;
  return (
    <Card
      sx={{
        bgcolor: s.bg,
        borderLeft: `4px solid ${s.border}`,
        animation: s.animation,
        '@keyframes pulse': {
          '0%, 100%': { boxShadow: `0 0 0 0 ${s.border}40` },
          '50%': { boxShadow: `0 0 12px 4px ${s.border}30` },
        },
      }}
    >
      <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ mt: 0.5 }}>{s.icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>{alert.label}</Typography>
            <Chip label={alert.source} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {alert.description}
          </Typography>
          {alert.action_required && (
            <Typography variant="body2" fontWeight={600} sx={{ color: s.border }}>
              Action: {alert.action_required}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
