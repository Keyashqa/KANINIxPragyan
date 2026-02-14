import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Box, ToggleButtonGroup, ToggleButton, IconButton, useMediaQuery,
  Divider, Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import QueueIcon from '@mui/icons-material/Queue';
import WarningIcon from '@mui/icons-material/Warning';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useRole } from '../context/RoleContext';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = {
  nurse: [
    { label: 'Patient Intake', icon: <PersonAddIcon />, path: '/nurse' },
  ],
  doctor: [
    { label: 'Patient Queue', icon: <QueueIcon />, path: '/doctor' },
    { label: 'Alert Panel', icon: <WarningIcon />, path: '/doctor/alerts' },
  ],
  admin: [
    { label: 'Analytics', icon: <DashboardIcon />, path: '/admin' },
  ],
};

export default function DashboardLayout() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleRoleChange = (_, newRole) => {
    if (!newRole) return;
    setRole(newRole);
    navigate(`/${newRole}`);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospitalIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            TriageAI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            District Hospital Assistant
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          ROLE
        </Typography>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={handleRoleChange}
          size="small"
          fullWidth
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' } }}
        >
          <ToggleButton value="nurse">Nurse</ToggleButton>
          <ToggleButton value="doctor">Doctor</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1 }}>
        {(NAV_ITEMS[role] || []).map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Chip
          icon={<MedicalServicesIcon />}
          label="Mock Mode"
          size="small"
          color="secondary"
          variant="outlined"
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRight: '1px solid', borderColor: 'divider' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" color="text.primary" fontWeight={600} sx={{ flex: 1 }}>
              {role === 'nurse' && 'Nurse Station'}
              {role === 'doctor' && 'Doctor Console'}
              {role === 'admin' && 'Admin Dashboard'}
            </Typography>
            <Chip label={new Date().toLocaleDateString('en-IN')} size="small" variant="outlined" />
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
