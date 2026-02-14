import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, ToggleButtonGroup, ToggleButton,
  FormControlLabel, Switch, Button, Chip, useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import QueueIcon from '@mui/icons-material/Queue';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTriage } from '../../context/TriageContext';
import RiskBadge from '../common/RiskBadge';
import PriorityCircle from '../common/PriorityCircle';
import ActionChip from '../common/ActionChip';
import { RISK_COLORS } from '../../utils/constants';

export default function PatientQueue() {
  const { patientQueue } = useTriage();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [riskFilter, setRiskFilter] = useState('ALL');
  const [redFlagOnly, setRedFlagOnly] = useState(false);

  const filtered = patientQueue.filter((p) => {
    if (riskFilter !== 'ALL' && p.final_risk_level !== riskFilter) return false;
    if (redFlagOnly && (!p.safety_alerts || !p.safety_alerts.some((a) => a.severity === 'CRITICAL'))) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.priority_score - a.priority_score);

  const columns = [
    {
      field: 'priority_score',
      headerName: 'Priority',
      width: 90,
      renderCell: (params) => <PriorityCircle score={params.value} size={40} />,
    },
    { field: 'patient_name', headerName: 'Patient', flex: 1, minWidth: 140 },
    {
      field: 'age_gender',
      headerName: 'Age/Gender',
      width: 110,
      valueGetter: (_, row) => `${row.age}/${row.gender?.[0] || ''}`,
    },
    {
      field: 'final_risk_level',
      headerName: 'Risk',
      width: 110,
      renderCell: (params) => <RiskBadge level={params.value} size="small" />,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => <ActionChip action={params.value} size="small" />,
    },
    { field: 'primary_department', headerName: 'Department', width: 160 },
    {
      field: 'safety_alerts',
      headerName: 'Alerts',
      width: 80,
      valueGetter: (v) => v?.length || 0,
      renderCell: (params) => params.value > 0 ? (
        <Chip label={params.value} size="small" sx={{ bgcolor: '#D32F2F', color: '#fff', fontWeight: 700 }} />
      ) : <Typography variant="body2" color="text.secondary">0</Typography>,
    },
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 100,
      valueGetter: (v) => {
        const mins = Math.floor((Date.now() - new Date(v).getTime()) / 60000);
        return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small" variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/doctor/case/${params.row.patient_id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <QueueIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>Patient Queue</Typography>
        <Chip label={`${sorted.length} patients`} size="small" color="primary" variant="outlined" sx={{ ml: 1 }} />
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="body2" fontWeight={600}>Filter:</Typography>
          <ToggleButtonGroup
            value={riskFilter} exclusive size="small"
            onChange={(_, v) => v && setRiskFilter(v)}
            sx={{ '& .MuiToggleButton-root': { textTransform: 'none', px: 2 } }}
          >
            <ToggleButton value="ALL">All</ToggleButton>
            <ToggleButton value="CRITICAL">Critical</ToggleButton>
            <ToggleButton value="HIGH">High</ToggleButton>
            <ToggleButton value="MEDIUM">Medium</ToggleButton>
            <ToggleButton value="LOW">Low</ToggleButton>
          </ToggleButtonGroup>
          <FormControlLabel
            control={<Switch checked={redFlagOnly} onChange={(e) => setRedFlagOnly(e.target.checked)} size="small" />}
            label={<Typography variant="body2">Critical Alerts Only</Typography>}
          />
        </CardContent>
      </Card>

      <Card>
        <DataGrid
          rows={sorted}
          columns={columns}
          getRowId={(row) => row.patient_id}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
            '& .risk-critical': {
              borderLeft: `4px solid ${RISK_COLORS.CRITICAL}`,
            },
            '& .risk-high': {
              borderLeft: `4px solid ${RISK_COLORS.HIGH}`,
            },
          }}
          getRowClassName={(params) => {
            if (params.row.final_risk_level === 'CRITICAL') return 'risk-critical';
            if (params.row.final_risk_level === 'HIGH') return 'risk-high';
            return '';
          }}
        />
      </Card>
    </Box>
  );
}
