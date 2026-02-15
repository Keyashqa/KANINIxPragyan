import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme,
} from '@mui/material';
import {
  LocalHospital, People, Groups, BarChart, Menu as MenuIcon,
} from '@mui/icons-material';

const DRAWER_W = 240;
const DRAWER_COLLAPSED = 64;

const NAV = [
  { label: 'New Triage', icon: <LocalHospital />, path: '/' },
  { label: 'Patient Queue', icon: <People />, path: '/queue' },
  { label: 'Council View', icon: <Groups />, path: '/council' },
  { label: 'Analytics', icon: <BarChart />, path: '/analytics' },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const compact = useMediaQuery('(max-width:1024px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const drawerWidth = compact ? DRAWER_COLLAPSED : DRAWER_W;

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      <List>
        {NAV.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
            sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: compact ? 'unset' : 40 }}>{item.icon}</ListItemIcon>
            {!compact && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_W } }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, transition: 'width 0.2s', overflowX: 'hidden' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: `${drawerWidth}px` }, transition: 'margin 0.2s' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid #E0E0E0' }}>
          <Toolbar>
            <IconButton sx={{ display: { md: 'none' }, mr: 1 }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>Ydhya</Typography>
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>Rapid Triage</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
