import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useTriageStore from '../state/triageStore';
import VerdictHeader from '../components/result/VerdictHeader';
import SafetyAlerts from '../components/result/SafetyAlerts';
import ExplanationCard from '../components/result/ExplanationCard';
import DepartmentRouting from '../components/result/DepartmentRouting';
import WorkupTable from '../components/result/WorkupTable';
import CouncilSummary from '../components/result/CouncilSummary';
import OtherDepartments from '../components/result/OtherDepartments';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function ResultPage() {
  const [tab, setTab] = useState(0);
  const { verdict } = useTriageStore();
  const navigate = useNavigate();

  if (!verdict) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">No triage result yet.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Start a triage from the intake form to see results here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <VerdictHeader verdict={verdict} />
      <SafetyAlerts alerts={verdict.safety_alerts} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Verdict" />
        <Tab label="Workup Plan" />
        <Tab label="Council Summary" />
        <Tab label="Other Departments" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ExplanationCard explanation={verdict.explanation} keyFactors={verdict.key_factors} />
        <DepartmentRouting verdict={verdict} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <WorkupTable workup={verdict.consolidated_workup} />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <CouncilSummary verdict={verdict} />
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <OtherDepartments departments={verdict.other_departments_flagged} />
      </TabPanel>
    </Box>
  );
}
