import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function getColor(score) {
  if (score >= 80) return '#B71C1C';
  if (score >= 60) return '#D32F2F';
  if (score >= 40) return '#F57C00';
  return '#388E3C';
}

export default function PriorityCircle({ score = 0, size = 100 }) {
  const [display, setDisplay] = useState(0);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (display / 100) * circ;
  const color = getColor(score);

  useEffect(() => {
    let frame;
    let start;
    const duration = 800;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(progress * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E0E0E0" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <Typography
        variant="h6"
        sx={{ position: 'absolute', fontWeight: 700, color, fontSize: size * 0.28 }}
      >
        {display}
      </Typography>
    </Box>
  );
}
