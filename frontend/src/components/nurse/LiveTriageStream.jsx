import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Chip, LinearProgress, Fade, Grow,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import BiotechIcon from '@mui/icons-material/Biotech';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { darkStreamTheme } from '../../theme';
import { RISK_COLORS } from '../../utils/constants';
import { useTriage } from '../../context/TriageContext';
import { submitTriage } from '../../services/api';
import RiskBadge from '../common/RiskBadge';

function PhaseIcon({ status }) {
  if (status === 'complete') return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
  if (status === 'active') return <HourglassTopIcon sx={{ color: '#FFC107', animation: 'spin 1.5s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />;
  return <RadioButtonUncheckedIcon sx={{ color: '#555' }} />;
}

export default function LiveTriageStream() {
  const navigate = useNavigate();
  const { currentPatient, setResult, addStreamEvent } = useTriage();
  const [phase, setPhase] = useState('idle');
  const [classification, setClassification] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const [statusMsg, setStatusMsg] = useState('Initializing AI triage...');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const handleEvent = (event) => {
      addStreamEvent(event);

      if (event.type === 'status') {
        setPhase(event.data.phase);
        setStatusMsg(event.data.message);
      } else if (event.type === 'classification_result') {
        setClassification(event.data);
        setPhase('classification_done');
      } else if (event.type === 'specialist_opinion') {
        setSpecialists((prev) => [...prev, event.data]);
      } else if (event.type === 'cmo_verdict') {
        setVerdict(event.data);
        setResult(event.data);
        setPhase('complete');
      } else if (event.type === 'complete') {
        setPhase('complete');
      }
    };

    submitTriage(currentPatient, handleEvent);
  }, []);

  const getPhaseStatus = (p) => {
    const order = ['classification', 'specialist_council', 'cmo_synthesis', 'complete'];
    const current = phase === 'classification_done' ? 'specialist_council' : phase;
    const ci = order.indexOf(current);
    const pi = order.indexOf(p);
    if (pi < ci) return 'complete';
    if (pi === ci) return 'active';
    return 'pending';
  };

  const content = (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4, px: 2, minHeight: '80vh' }}>
      <Typography variant="h5" fontWeight={700} color="white" textAlign="center" gutterBottom>
        AI Triage in Progress
      </Typography>
      {currentPatient && (
        <Typography variant="body2" textAlign="center" sx={{ color: '#B0B0B0', mb: 4 }}>
          Patient: {currentPatient.name} | ID: {currentPatient.patient_id}
        </Typography>
      )}

      <Fade in><Typography variant="body2" textAlign="center" sx={{ color: '#90CAF9', mb: 3 }}>{statusMsg}</Typography></Fade>

      {phase !== 'complete' && <LinearProgress sx={{ mb: 4, borderRadius: 2, bgcolor: '#333', '& .MuiLinearProgress-bar': { bgcolor: '#1A73E8' } }} />}

      {/* Phase 1: Classification */}
      <Paper sx={{ bgcolor: '#16213E', p: 3, mb: 2, borderRadius: 2, border: getPhaseStatus('classification') === 'active' ? '1px solid #1A73E8' : '1px solid #2A2A4A' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PhaseIcon status={getPhaseStatus('classification')} />
          <BiotechIcon sx={{ color: '#90CAF9' }} />
          <Typography variant="subtitle1" fontWeight={600} color="white">Classification Agent</Typography>
        </Box>
        {classification && (
          <Grow in>
            <Box sx={{ ml: 5, mt: 1, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <RiskBadge level={classification.risk_level} />
              <Chip label={`Confidence: ${(classification.confidence * 100).toFixed(0)}%`} size="small" sx={{ color: '#fff', borderColor: '#555' }} variant="outlined" />
              <Chip label={classification.triage_category} size="small" sx={{ bgcolor: '#1A73E8', color: '#fff' }} />
            </Box>
          </Grow>
        )}
      </Paper>

      {/* Phase 2: Specialist Council */}
      <Paper sx={{ bgcolor: '#16213E', p: 3, mb: 2, borderRadius: 2, border: getPhaseStatus('specialist_council') === 'active' ? '1px solid #00897B' : '1px solid #2A2A4A' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PhaseIcon status={getPhaseStatus('specialist_council')} />
          <GroupsIcon sx={{ color: '#80CBC4' }} />
          <Typography variant="subtitle1" fontWeight={600} color="white">Specialist Council</Typography>
          {specialists.length > 0 && (
            <Chip label={`${specialists.length}/5`} size="small" sx={{ color: '#fff', bgcolor: '#00897B' }} />
          )}
        </Box>
        <Box sx={{ ml: 5, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {specialists.map((sp, i) => (
            <Grow in key={sp.specialty} timeout={300 + i * 100}>
              <Paper sx={{
                bgcolor: '#1A1A2E', p: 1.5, borderRadius: 1, minWidth: 140,
                border: sp.claims_primary ? '1px solid #00897B' : '1px solid #333',
              }}>
                <Typography variant="caption" fontWeight={600} color="white">{sp.specialty}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Chip label={`R: ${(sp.relevance_score * 100).toFixed(0)}%`} size="small"
                    sx={{ fontSize: '0.65rem', height: 18, color: '#fff', bgcolor: '#333' }} />
                  <Chip label={`U: ${(sp.urgency_score * 100).toFixed(0)}%`} size="small"
                    sx={{ fontSize: '0.65rem', height: 18, color: '#fff', bgcolor: '#333' }} />
                </Box>
              </Paper>
            </Grow>
          ))}
        </Box>
      </Paper>

      {/* Phase 3: CMO Synthesis */}
      <Paper sx={{ bgcolor: '#16213E', p: 3, mb: 3, borderRadius: 2, border: getPhaseStatus('cmo_synthesis') === 'active' ? '1px solid #F57C00' : '1px solid #2A2A4A' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PhaseIcon status={getPhaseStatus('cmo_synthesis')} />
          <GavelIcon sx={{ color: '#FFB74D' }} />
          <Typography variant="subtitle1" fontWeight={600} color="white">CMO Synthesis</Typography>
        </Box>
        {verdict && (
          <Grow in>
            <Box sx={{ ml: 5, mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <RiskBadge level={verdict.final_risk_level} sx={{ fontSize: '1rem', py: 0.5, px: 1 }} />
                <Typography variant="body2" sx={{ color: '#FFB74D' }}>
                  Priority: {verdict.priority_score}/100
                </Typography>
                <Chip label={verdict.action} size="small" sx={{ bgcolor: '#F57C00', color: '#fff' }} />
              </Box>
            </Box>
          </Grow>
        )}
      </Paper>

      {phase === 'complete' && (
        <Fade in>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate('/nurse/result')}
              sx={{ py: 1.5, px: 6, fontSize: '1rem' }}
            >
              View Full Report
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={darkStreamTheme}>
      <Box sx={{ bgcolor: '#1A1A2E', minHeight: '100%', mx: -3, my: -3, p: 3, borderRadius: 2 }}>
        {content}
      </Box>
    </ThemeProvider>
  );
}
