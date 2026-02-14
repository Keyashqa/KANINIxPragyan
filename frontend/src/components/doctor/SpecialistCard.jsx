import { useState } from 'react';
import {
  Card, CardContent, Typography, Box, LinearProgress, Chip, Accordion,
  AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlagChip from '../common/FlagChip';

const SPECIALTY_COLORS = {
  Cardiology: '#E53935',
  Neurology: '#5E35B1',
  Pulmonology: '#1E88E5',
  'Emergency Medicine': '#F57C00',
  'General Medicine': '#00897B',
};

export default function SpecialistCard({ opinion }) {
  const color = SPECIALTY_COLORS[opinion.specialty] || '#757575';

  return (
    <Card sx={{ borderTop: `3px solid ${color}`, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>{opinion.specialty}</Typography>
          <Chip
            label={`${(opinion.confidence * 100).toFixed(0)}%`}
            size="small"
            sx={{ bgcolor: color, color: '#fff', fontWeight: 600 }}
          />
        </Box>

        {opinion.claims_primary && (
          <Chip label="Claims Primary" size="small" color="primary" sx={{ mb: 1 }} />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
          {opinion.one_liner}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Relevance</Typography>
            <Typography variant="caption" fontWeight={600}>{(opinion.relevance_score * 100).toFixed(0)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={opinion.relevance_score * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: color } }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Urgency</Typography>
            <Typography variant="caption" fontWeight={600}>{(opinion.urgency_score * 100).toFixed(0)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={opinion.urgency_score * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: color } }}
          />
        </Box>

        {opinion.flags && opinion.flags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
            {opinion.flags.map((f, i) => (
              <FlagChip key={i} severity={f.severity} label={f.label} />
            ))}
          </Box>
        )}

        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' }, bgcolor: '#F5F7FA' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight={600}>Full Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>{opinion.assessment}</Typography>

            {opinion.differentials && opinion.differentials.length > 0 && (
              <>
                <Typography variant="caption" fontWeight={700} gutterBottom sx={{ display: 'block' }}>
                  Differentials
                </Typography>
                <TableContainer sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableBody>
                      {opinion.differentials.map((d, i) => (
                        <TableRow key={i}>
                          <TableCell>{d.condition}</TableCell>
                          <TableCell align="right">
                            <Chip label={`${(d.probability * 100).toFixed(0)}%`} size="small" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {opinion.recommended_workup && opinion.recommended_workup.length > 0 && (
              <>
                <Typography variant="caption" fontWeight={700} gutterBottom sx={{ display: 'block' }}>
                  Recommended Workup
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Test</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {opinion.recommended_workup.map((w, i) => (
                        <TableRow key={i}>
                          <TableCell>{w.test}</TableCell>
                          <TableCell>
                            <Chip label={w.priority} size="small" sx={{
                              fontWeight: 600, fontSize: '0.7rem',
                              bgcolor: w.priority === 'STAT' ? '#D32F2F' : w.priority === 'URGENT' ? '#F57C00' : '#9E9E9E',
                              color: '#fff',
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
