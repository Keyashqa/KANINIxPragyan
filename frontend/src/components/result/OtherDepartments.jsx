import { useState } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Button, Stack } from '@mui/material';

export default function OtherDepartments({ departments = [] }) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...departments].sort((a, b) => b.relevance - a.relevance);
  const filtered = showAll ? sorted : sorted.filter((d) => d.relevance >= 3);

  if (!sorted.length) return <Typography color="text.secondary">No other departments flagged.</Typography>;

  return (
    <Box>
      <Stack spacing={1.5}>
        {filtered.map((d) => (
          <Card key={d.name} variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600}>{d.name}</Typography>
                <Typography variant="caption">{d.relevance}/10</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={d.relevance * 10}
                sx={{
                  mt: 0.5, height: 6, borderRadius: 3,
                  bgcolor: '#EEE',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: d.relevance >= 7 ? '#D32F2F' : d.relevance >= 4 ? '#F57C00' : '#388E3C',
                  },
                }}
              />
              {d.reason && <Typography variant="caption" color="text.secondary">{d.reason}</Typography>}
            </CardContent>
          </Card>
        ))}
      </Stack>
      {sorted.some((d) => d.relevance < 3) && (
        <Button size="small" sx={{ mt: 1 }} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Relevant Only' : 'Show All'}
        </Button>
      )}
    </Box>
  );
}
