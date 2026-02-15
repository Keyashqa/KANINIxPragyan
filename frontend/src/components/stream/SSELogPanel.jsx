import { useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useTriageStore from '../../state/triageStore';

const EVENT_ICONS = {
  status: '\u2139\uFE0F',
  classification: '\uD83C\uDFAF',
  specialist: '\uD83E\uDE7A',
  other: '\uD83C\uDFE5',
  verdict: '\u2696\uFE0F',
  complete: '\u2705',
  error: '\u274C',
};

const EVENT_COLORS = {
  status: '#90CAF9',
  classification: '#CE93D8',
  specialist: '#80CBC4',
  other: '#FFB74D',
  verdict: '#FFF176',
  complete: '#A5D6A7',
  error: '#EF9A9A',
};

export default function SSELogPanel() {
  const { streamEvents, phase } = useTriageStore();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamEvents]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Paper
      sx={{
        bgcolor: '#1A1A2E', borderRadius: 3, p: 2, height: '100%',
        minHeight: 400, display: 'flex', flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#90CAF9', mb: 1, fontFamily: 'monospace' }}>
        Live Pipeline Stream
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: 13 }}>
        {streamEvents.length === 0 && (
          <Typography
            sx={{
              color: '#555',
              textAlign: 'center',
              mt: 8,
              animation: phase === 'idle' ? 'pulse-critical 2s infinite' : 'none',
            }}
          >
            Waiting for patient data...
          </Typography>
        )}

        {streamEvents.map((evt, i) => (
          <Box
            key={i}
            className="fade-in"
            sx={{ py: 0.5, borderBottom: '1px solid #2A2A3E' }}
          >
            <Typography component="span" sx={{ color: '#666', fontSize: 11, mr: 1 }}>
              {formatTime(evt.ts)}
            </Typography>
            <Typography component="span" sx={{ mr: 1 }}>
              {EVENT_ICONS[evt.type] || '\u25CF'}
            </Typography>
            <Typography component="span" sx={{ color: EVENT_COLORS[evt.type] || '#CCC' }}>
              {evt.message}
            </Typography>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      {phase === 'complete' && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography sx={{ color: '#A5D6A7', mb: 1, fontWeight: 600 }}>
            Triage Complete
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/result')}
            sx={{ fontWeight: 600 }}
          >
            View Full Report &rarr;
          </Button>
        </Box>
      )}
    </Paper>
  );
}
