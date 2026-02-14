import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Box, Paper,
} from '@mui/material';

const PRIORITY_ORDER = { STAT: 0, URGENT: 1, ROUTINE: 2 };
const PRIORITY_STYLES = {
  STAT: { bg: '#D32F2F', border: '#D32F2F' },
  URGENT: { bg: '#F57C00', border: '#F57C00' },
  ROUTINE: { bg: '#9E9E9E', border: '#9E9E9E' },
};

export default function ConsolidatedWorkup({ workup }) {
  if (!workup || workup.length === 0) return null;

  const sorted = [...workup].sort((a, b) =>
    (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  );

  const groups = {};
  sorted.forEach((w) => {
    if (!groups[w.priority]) groups[w.priority] = [];
    groups[w.priority].push(w);
  });

  return (
    <Box>
      {Object.entries(groups).map(([priority, items]) => (
        <Box key={priority} sx={{ mb: 3 }}>
          <Chip
            label={priority}
            sx={{ mb: 1, fontWeight: 700, bgcolor: PRIORITY_STYLES[priority]?.bg || '#9E9E9E', color: '#fff' }}
          />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Test</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ordered By</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rationale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((w, i) => (
                  <TableRow key={i} sx={{
                    borderLeft: `4px solid ${PRIORITY_STYLES[priority]?.border || '#9E9E9E'}`,
                  }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{w.test}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(w.ordered_by || []).map((s) => (
                          <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{w.rationale}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
}
