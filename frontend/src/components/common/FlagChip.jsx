import { Chip, Tooltip } from '@mui/material';
import { FLAG_COLORS } from '../../utils/constants';

export default function FlagChip({ severity, label, pattern }) {
  const color = FLAG_COLORS[severity] || '#757575';
  return (
    <Tooltip title={pattern || ''} arrow>
      <Chip
        label={label}
        size="small"
        sx={{ bgcolor: color, color: '#fff', fontWeight: 600, mr: 0.5, mb: 0.5 }}
      />
    </Tooltip>
  );
}
