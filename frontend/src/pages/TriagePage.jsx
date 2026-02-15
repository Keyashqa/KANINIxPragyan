import { Box, Grid } from '@mui/material';
import PatientForm from '../components/intake/PatientForm';
import DocumentUpload from '../components/intake/DocumentUpload';
import SSELogPanel from '../components/stream/SSELogPanel';

export default function TriagePage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <PatientForm />
        <DocumentUpload />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <SSELogPanel />
      </Grid>
    </Grid>
  );
}
