import { Chip } from '@mui/material';
import { RISK_COLORS } from '../../utils/constants';

export default function RiskBadge({ level, size = 'medium', sx = {} }) {
  const color = RISK_COLORS[level] || '#757575';
  return (
    <Chip
      label={level}
      size={size}
      sx={{
        bgcolor: color,
        color: '#FFF',
        fontWeight: 700,
        letterSpacing: 0.5,
        ...sx,
      }}
    />
  );
}
