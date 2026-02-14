import { Chip } from '@mui/material';
import { ACTION_COLORS } from '../../utils/constants';

export default function ActionChip({ action, size = 'medium' }) {
  const style = ACTION_COLORS[action] || ACTION_COLORS['STANDARD'];
  return (
    <Chip
      label={action}
      size={size}
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700 }}
    />
  );
}
