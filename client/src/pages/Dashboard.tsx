import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Divider, Drawer, Toolbar, Typography, AppBar, Button } from '@mui/material';
import ChatWindow from '@/components/chat/ChatWindow';
import UserList from '@/components/chat/UserList';
import WelcomePage from '@/components/chat/WelcomePage';
import logo from '../assets/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/AuthContext';

const drawerWidth = 250;

const Dashboard: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { user, logout } = useAuth();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCurrentUsername(user.username);
    }
  }, [user]);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            <img src={logo} width={200} />
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <UserList onSelectUser={handleUserSelect} />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, height: '100vh' }}
      >
        <Toolbar />
        {selectedUserId ? (
          <ChatWindow userId={selectedUserId} />
        ) : (
          <WelcomePage username={currentUsername} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;