import { Chip } from '@mui/material';
import { ACTION_COLORS } from '../../utils/constants';

export default function ActionChip({ action }) {
  const color = ACTION_COLORS[action] || '#757575';
  return (
    <Chip
      label={action}
      size="small"
      sx={{ bgcolor: color, color: '#fff', fontWeight: 600 }}
    />
  );
}
