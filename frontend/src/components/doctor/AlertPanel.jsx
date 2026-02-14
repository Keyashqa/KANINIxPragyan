import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Chip, Grid,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useTriage } from '../../context/TriageContext';
import SafetyAlertCard from '../common/SafetyAlertCard';
import RiskBadge from '../common/RiskBadge';

export default function AlertPanel() {
  const { patientQueue } = useTriage();
  const navigate = useNavigate();

  const patientsWithAlerts = patientQueue.filter(
    (p) => p.safety_alerts && p.safety_alerts.length > 0
  ).sort((a, b) => {
    const aHasCritical = a.safety_alerts.some((al) => al.severity === 'CRITICAL');
    const bHasCritical = b.safety_alerts.some((al) => al.severity === 'CRITICAL');
    if (aHasCritical && !bHasCritical) return -1;
    if (!aHasCritical && bHasCritical) return 1;
    return b.priority_score - a.priority_score;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <WarningIcon sx={{ color: '#D32F2F', fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>Alert Panel</Typography>
        <Chip
          label={`${patientsWithAlerts.length} patients with alerts`}
          size="small" sx={{ bgcolor: '#FFEBEE', color: '#D32F2F', fontWeight: 600 }}
        />
      </Box>

      {patientsWithAlerts.length === 0 ? (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography color="text.secondary">No active alerts.</Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {patientsWithAlerts.map((p) => (
            <Card key={p.patient_id} sx={{ borderLeft: '4px solid #D32F2F' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{p.patient_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.patient_id} | {p.age}y {p.gender} | {p.primary_department}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <RiskBadge level={p.final_risk_level} size="small" />
                    <Button
                      variant="contained" size="small"
                      onClick={() => navigate(`/doctor/case/${p.patient_id}`)}
                    >
                      Review Case
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {p.safety_alerts.map((alert, i) => (
                    <SafetyAlertCard key={i} alert={alert} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
