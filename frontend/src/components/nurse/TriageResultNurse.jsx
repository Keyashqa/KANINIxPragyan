import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTriage } from '../../context/TriageContext';
import RiskBadge from '../common/RiskBadge';
import PriorityCircle from '../common/PriorityCircle';
import ActionChip from '../common/ActionChip';
import SafetyAlertCard from '../common/SafetyAlertCard';
import { RISK_BG_COLORS, RISK_COLORS } from '../../utils/constants';

export default function TriageResultNurse() {
  const { triageResult } = useTriage();
  const navigate = useNavigate();

  if (!triageResult) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" gutterBottom>No triage result available</Typography>
        <Button variant="contained" onClick={() => navigate('/nurse')}>Start New Triage</Button>
      </Box>
    );
  }

  const r = triageResult;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Card sx={{
        mb: 3, bgcolor: RISK_BG_COLORS[r.final_risk_level] || '#FFF',
        borderLeft: `6px solid ${RISK_COLORS[r.final_risk_level]}`,
      }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5" fontWeight={700}>{r.patient_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {r.patient_id} | {r.age}y {r.gender}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, flexWrap: 'wrap' }}>
                <RiskBadge level={r.final_risk_level} sx={{ fontSize: '1.1rem', py: 1, px: 2 }} />
                <PriorityCircle score={r.priority_score} size={56} />
                <ActionChip action={r.action} />
              </Box>
            </Grid>
          </Grid>
          {r.risk_adjusted && (
            <Chip label="Risk Adjusted" color="warning" size="small" sx={{ mt: 1 }} />
          )}
        </CardContent>
      </Card>

      {/* Safety Alerts */}
      {r.safety_alerts && r.safety_alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Safety Alerts</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {r.safety_alerts.map((alert, i) => (
              <SafetyAlertCard key={i} alert={alert} />
            ))}
          </Box>
        </Box>
      )}

      {/* Explanation */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Clinical Summary</Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{r.explanation}</Typography>
        </CardContent>
      </Card>

      {/* Key Factors */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Key Factors</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {r.key_factors?.map((factor, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label={i + 1} size="small" sx={{ minWidth: 28, bgcolor: 'primary.main', color: '#fff' }} />
                <Typography variant="body2">{factor}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Routing */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Department Routing</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 2, bgcolor: 'primary.main', color: '#fff', borderRadius: 2 }}>
                <Typography variant="caption">Primary Department</Typography>
                <Typography variant="h6" fontWeight={700}>{r.primary_department}</Typography>
              </Paper>
            </Grid>
            {r.secondary_department && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ p: 2, bgcolor: 'secondary.main', color: '#fff', borderRadius: 2 }}>
                  <Typography variant="caption">Secondary Department</Typography>
                  <Typography variant="h6" fontWeight={700}>{r.secondary_department}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          {r.requires_referral && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: '#FFF3E0', border: '1px solid #F57C00', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="warning.main" fontWeight={700}>Referral Required</Typography>
              <Typography variant="body2">{r.referral_reason}</Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Workup Summary */}
      {r.consolidated_workup && r.consolidated_workup.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Ordered Workup</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Test</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rationale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {r.consolidated_workup.slice(0, 6).map((w, i) => (
                    <TableRow key={i} sx={{
                      borderLeft: w.priority === 'STAT' ? '3px solid #D32F2F' :
                        w.priority === 'URGENT' ? '3px solid #F57C00' : '3px solid #9E9E9E',
                    }}>
                      <TableCell>{w.test}</TableCell>
                      <TableCell>
                        <Chip label={w.priority} size="small" sx={{
                          fontWeight: 600,
                          bgcolor: w.priority === 'STAT' ? '#D32F2F' : w.priority === 'URGENT' ? '#F57C00' : '#9E9E9E',
                          color: '#fff',
                        }} />
                      </TableCell>
                      <TableCell><Typography variant="body2">{w.rationale}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained" size="large" fullWidth
        onClick={() => navigate('/nurse')}
        endIcon={<ArrowForwardIcon />}
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        Triage Next Patient
      </Button>
    </Box>
  );
}
