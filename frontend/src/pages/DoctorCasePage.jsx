import { useParams } from 'react-router-dom';
import CaseDetailView from '../components/doctor/CaseDetailView';
import { useTriage } from '../context/TriageContext';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DoctorCasePage() {
  const { id } = useParams();
  const { getPatientById } = useTriage();
  const navigate = useNavigate();
  const patient = getPatientById(id);

  if (!patient) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>Patient not found</Typography>
        <Button variant="contained" onClick={() => navigate('/doctor')}>Back to Queue</Button>
      </Box>
    );
  }

  return <CaseDetailView patient={patient} />;
}
