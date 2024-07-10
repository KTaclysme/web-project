import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '@/context/AuthContext';
import socket from '@/sockets';

interface ChatWindowProps {
  userId: number;
  username: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setMessages([]);
  }, [userId]);

  useEffect(() => {
    if (!user?.id) {
      console.error('User ID is not defined');
      return;
    }

    socket.on('receiveMessage', (message: Message) => {
      if (message.sender !== user.username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [user]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message: Message = {
        id: messages.length + 1,
        sender: user.username,
        content: newMessage,
      };

      setMessages([...messages, message]);

      socket.emit('sendMessage', {
        fromUserId: user.id,
        toUserId: userId,
        content: newMessage,
      });

      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
      <Typography variant="h6" gutterBottom>
        Conversation avec {username}
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ justifyContent: message.sender === user?.username ? 'flex-end' : 'flex-start' }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor: message.sender === user?.username ? 'primary.main' : 'grey.300',
                  color: message.sender === user?.username ? 'white' : 'black',
                  borderRadius: 2,
                  maxWidth: '60%',
                }}
              >
                <ListItemText
                  primary={message.sender}
                  secondary={message.content}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;