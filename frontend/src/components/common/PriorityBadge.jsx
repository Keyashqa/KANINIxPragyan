import { Chip } from '@mui/material';
import { PRIORITY_COLORS } from '../../utils/constants';

export default function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || '#9E9E9E';
  return (
    <Chip
      label={priority}
      size="small"
      sx={{ bgcolor: color, color: '#fff', fontWeight: 700, fontSize: 11 }}
    />
  );
}
