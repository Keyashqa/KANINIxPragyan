import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Grid, Button, Autocomplete,
  Chip, MenuItem, Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { SYMPTOM_LIST, CONDITION_LIST } from '../../utils/constants';
import { useTriage } from '../../context/TriageContext';

const generateId = () => `PAT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

const initialForm = {
  name: '',
  patient_id: generateId(),
  age: '',
  gender: '',
  heart_rate: '',
  blood_pressure_systolic: '',
  blood_pressure_diastolic: '',
  temperature: '',
  spo2: '',
  symptoms: [],
  medical_history: [],
};

export default function PatientIntakeForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { submitPatient } = useTriage();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.age || form.age < 0 || form.age > 150) errs.age = 'Valid age required';
    if (!form.gender) errs.gender = 'Required';
    if (!form.heart_rate) errs.heart_rate = 'Required';
    if (!form.blood_pressure_systolic) errs.blood_pressure_systolic = 'Required';
    if (!form.blood_pressure_diastolic) errs.blood_pressure_diastolic = 'Required';
    if (!form.temperature) errs.temperature = 'Required';
    if (!form.spo2) errs.spo2 = 'Required';
    if (form.symptoms.length === 0) errs.symptoms = 'At least 1 symptom required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const patient = {
      patient_id: form.patient_id,
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      vitals: {
        heart_rate: Number(form.heart_rate),
        blood_pressure_systolic: Number(form.blood_pressure_systolic),
        blood_pressure_diastolic: Number(form.blood_pressure_diastolic),
        temperature: Number(form.temperature),
        spo2: Number(form.spo2),
      },
      symptoms: form.symptoms,
      medical_history: form.medical_history,
    };

    submitPatient(patient);
    navigate('/nurse/triage');
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PersonAddIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>New Patient Intake</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Patient Information</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Patient Name" fullWidth required
                  value={form.name} onChange={handleChange('name')}
                  error={!!errors.name} helperText={errors.name}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Patient ID" fullWidth disabled value={form.patient_id}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Age" type="number" fullWidth required
                  value={form.age} onChange={handleChange('age')}
                  error={!!errors.age} helperText={errors.age}
                  inputProps={{ min: 0, max: 150 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Gender" select fullWidth required
                  value={form.gender} onChange={handleChange('gender')}
                  error={!!errors.gender} helperText={errors.gender}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Vitals</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Heart Rate (bpm)" type="number" fullWidth required
                  value={form.heart_rate} onChange={handleChange('heart_rate')}
                  error={!!errors.heart_rate} helperText={errors.heart_rate}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="BP Systolic (mmHg)" type="number" fullWidth required
                  value={form.blood_pressure_systolic} onChange={handleChange('blood_pressure_systolic')}
                  error={!!errors.blood_pressure_systolic} helperText={errors.blood_pressure_systolic}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="BP Diastolic (mmHg)" type="number" fullWidth required
                  value={form.blood_pressure_diastolic} onChange={handleChange('blood_pressure_diastolic')}
                  error={!!errors.blood_pressure_diastolic} helperText={errors.blood_pressure_diastolic}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Temperature (°C)" type="number" fullWidth required
                  value={form.temperature} onChange={handleChange('temperature')}
                  error={!!errors.temperature} helperText={errors.temperature}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="SpO2 (%)" type="number" fullWidth required
                  value={form.spo2} onChange={handleChange('spo2')}
                  error={!!errors.spo2} helperText={errors.spo2}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Symptoms & History</Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Autocomplete
                  multiple
                  options={SYMPTOM_LIST}
                  value={form.symptoms}
                  onChange={(_, v) => {
                    setForm((f) => ({ ...f, symptoms: v }));
                    setErrors((err) => ({ ...err, symptoms: undefined }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option} size="small" color="primary" variant="outlined" {...getTagProps({ index })} key={option} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params} label="Symptoms" placeholder="Type to search..."
                      error={!!errors.symptoms} helperText={errors.symptoms}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Autocomplete
                  multiple
                  options={CONDITION_LIST}
                  value={form.medical_history}
                  onChange={(_, v) => setForm((f) => ({ ...f, medical_history: v }))}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option} size="small" color="secondary" variant="outlined" {...getTagProps({ index })} key={option} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Medical History" placeholder="Type to search..." />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>Please fill in all required fields.</Alert>
        )}

        <Button
          type="submit" variant="contained" size="large" fullWidth
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Start AI Triage
        </Button>
      </form>
    </Box>
  );
}
