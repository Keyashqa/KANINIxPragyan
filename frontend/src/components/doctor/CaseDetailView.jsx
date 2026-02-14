import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Tabs, Tab, Chip, Paper, Button,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RiskBadge from '../common/RiskBadge';
import PriorityCircle from '../common/PriorityCircle';
import ActionChip from '../common/ActionChip';
import SafetyAlertCard from '../common/SafetyAlertCard';
import FlagChip from '../common/FlagChip';
import SpecialistCard from './SpecialistCard';
import SpecialistRadarChart from './SpecialistRadarChart';
import CouncilConsensus from './CouncilConsensus';
import ConsolidatedWorkup from './ConsolidatedWorkup';
import { RISK_BG_COLORS, RISK_COLORS } from '../../utils/constants';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function CaseDetailView({ patient }) {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const p = patient;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/doctor')} sx={{ mb: 2 }}>
        Back to Queue
      </Button>

      {/* Patient Header */}
      <Card sx={{ mb: 3, borderLeft: `6px solid ${RISK_COLORS[p.final_risk_level]}` }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" fontWeight={700}>{p.patient_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {p.patient_id} | {p.age}y {p.gender} | {p.primary_department}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {p.symptoms?.map((s) => (
                  <Chip key={s} label={s} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                <RiskBadge level={p.final_risk_level} sx={{ fontSize: '1rem', py: 0.5 }} />
                <PriorityCircle score={p.priority_score} size={56} />
                <ActionChip action={p.action} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="Overview" />
        <Tab label="Safety & Alerts" />
        <Tab label="Workup Plan" />
        <Tab label="Explanation" />
      </Tabs>

      {/* Tab 1: Overview */}
      <TabPanel value={tab} index={0}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', bgcolor: RISK_BG_COLORS[p.final_risk_level] }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Risk Assessment</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <RiskBadge level={p.final_risk_level} />
                  <PriorityCircle score={p.priority_score} size={44} />
                </Box>
                {p.ml_risk_assessment !== p.final_risk_level && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    ML: {p.ml_risk_assessment} → Final: {p.final_risk_level}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Routing</Typography>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>{p.primary_department}</Typography>
                {p.secondary_department && (
                  <Typography variant="body2" color="text.secondary">Secondary: {p.secondary_department}</Typography>
                )}
                {p.requires_referral && (
                  <Chip label="Referral Required" color="warning" size="small" sx={{ mt: 1 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CouncilConsensus consensus={p.council_consensus} dissenting={p.dissenting_opinions} />
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight={600} gutterBottom>Specialist Analysis</Typography>
        <Card sx={{ mb: 3, p: 2 }}>
          <SpecialistRadarChart opinions={p.specialist_opinions} />
        </Card>

        <Grid container spacing={2}>
          {p.specialist_opinions?.map((op) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={op.specialty}>
              <SpecialistCard opinion={op} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 2: Safety & Alerts */}
      <TabPanel value={tab} index={1}>
        {p.safety_alerts && p.safety_alerts.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {p.safety_alerts.map((alert, i) => (
              <SafetyAlertCard key={i} alert={alert} />
            ))}
          </Box>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No safety alerts for this patient.</Typography>
          </Paper>
        )}

        {p.specialist_opinions && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Specialist Flags</Typography>
            {p.specialist_opinions.filter((op) => op.flags?.length > 0).map((op) => (
              <Box key={op.specialty} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>{op.specialty}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {op.flags.map((f, i) => (
                    <FlagChip key={i} severity={f.severity} label={`${f.label}: ${f.description}`} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

      {/* Tab 3: Workup Plan */}
      <TabPanel value={tab} index={2}>
        <ConsolidatedWorkup workup={p.consolidated_workup} />
      </TabPanel>

      {/* Tab 4: Explanation */}
      <TabPanel value={tab} index={3}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Clinical Summary</Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{p.explanation}</Typography>
          </CardContent>
        </Card>

        {p.key_factors && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Key Factors</Typography>
              {p.key_factors.map((f, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
                  <Chip label={i + 1} size="small" sx={{ minWidth: 28, bgcolor: 'primary.main', color: '#fff' }} />
                  <Typography variant="body2">{f}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {p.ml_risk_assessment && p.final_risk_level && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Risk Comparison</Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">ML Assessment</Typography>
                  <Box sx={{ mt: 0.5 }}><RiskBadge level={p.ml_risk_assessment} /></Box>
                </Box>
                <Typography variant="h5">→</Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary">Final Risk Level</Typography>
                  <Box sx={{ mt: 0.5 }}><RiskBadge level={p.final_risk_level} /></Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </TabPanel>
    </Box>
  );
}
