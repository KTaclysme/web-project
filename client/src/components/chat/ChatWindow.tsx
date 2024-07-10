import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatWindowProps {
  username: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'Moi',
        content: newMessage,
      };
      setMessages([...messages, message]);
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
            <ListItem key={message.id} sx={{ justifyContent: message.sender === 'Moi' ? 'flex-end' : 'flex-start' }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor: message.sender === 'Moi' ? 'primary.main' : 'grey.300',
                  color: message.sender === 'Moi' ? 'white' : 'black',
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