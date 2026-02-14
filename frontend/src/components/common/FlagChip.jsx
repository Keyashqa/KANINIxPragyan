import { Chip } from '@mui/material';
import { FLAG_COLORS } from '../../utils/constants';

export default function FlagChip({ severity, label }) {
  const style = FLAG_COLORS[severity] || FLAG_COLORS.INFO;
  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 600, fontSize: '0.75rem' }}
    />
  );
}
