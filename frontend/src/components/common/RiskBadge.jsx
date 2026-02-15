import { Chip } from '@mui/material';
import { RISK_COLORS } from '../../utils/constants';

export default function RiskBadge({ level, size = 'medium' }) {
  const color = RISK_COLORS[level] || '#9E9E9E';
  const isCritical = level === 'Critical';

  return (
    <Chip
      label={level}
      size={size}
      className={isCritical ? 'pulse-critical' : ''}
      sx={{
        bgcolor: color,
        color: '#fff',
        fontWeight: 700,
        fontSize: size === 'large' ? 16 : 13,
        px: size === 'large' ? 2 : 0,
      }}
    />
  );
}
