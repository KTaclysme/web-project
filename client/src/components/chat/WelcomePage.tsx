import React from 'react';
import { Box, Typography, } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

interface WelcomePageProps {
  username: string | null;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ username }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '85%',
        textAlign: 'center',
        p: 3,
      }}
    >
      <ChatIcon sx={{ fontSize: 100, mb: 3, color: 'primary.main' }} />
      <Typography variant="h3" gutterBottom>
        {username}, bienvenue sur Chatify!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Ton application de chat moderne et élégante.
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sélectionne un utilisateur à gauche pour commencer à discuter. Profite d'une interface simple et agréable pour échanger avec tes amis et collègues.
      </Typography>
    </Box>
  );
};

export default WelcomePage;