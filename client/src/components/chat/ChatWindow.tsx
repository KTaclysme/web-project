import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Box, Typography, TextField, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '@/context/AuthContext';
import sockets from '@/sockets';

const GET_MESSAGES = gql`
  query GetMessages($userId1: Int!, $userId2: Int!) {
    findAllMessagesBetweenUsers(userId1: $userId1, userId2: $userId2) {
      id
      fromUserId
      toUserId
      createdAt
      content
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($messageInput: MessageInput!) {
    sendMessage(messageInput: $messageInput)
  }
`;

interface ChatWindowProps {
  userId: number;
  username: string;
}

interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  createdAt: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, username }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { loading, error } = useQuery(GET_MESSAGES, {
    variables: { userId1: user?.id, userId2: userId },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      setMessages(data.findAllMessagesBetweenUsers);
    },
  });
  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (!user?.id) {
      console.error('User ID is not defined');
      return;
    }

    const handleReceiveMessage = (message: Message) => {
      if (
        (message.fromUserId === Number(user.id) && message.toUserId === userId) ||
        (message.fromUserId === userId && message.toUserId === Number(user.id))
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    sockets.on('receiveMessage', handleReceiveMessage);

    return () => {
      sockets.off('receiveMessage', handleReceiveMessage);
    };
  }, [user, userId]);

  useEffect(() => {
    setMessages([]);
  }, [userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now(),
        fromUserId: Number(user.id),
        toUserId: userId,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);

      try {
        await sendMessage({
          variables: {
            messageInput: {
              content: newMessage,
              toUserId: userId,
            },
          },
          update: (cache) => {
            const existingMessages: any = cache.readQuery({
              query: GET_MESSAGES,
              variables: { userId1: user.id, userId2: userId },
            });

            if (existingMessages) {
              cache.writeQuery({
                query: GET_MESSAGES,
                variables: { userId1: user.id, userId2: userId },
                data: {
                  findAllMessagesBetweenUsers: [...existingMessages.findAllMessagesBetweenUsers, { ...message, id: existingMessages.findAllMessagesBetweenUsers.length + 1 }],
                },
              });
            }
          },
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
      <Typography variant="h6" gutterBottom>
        Conversation avec {username}
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ justifyContent: message.fromUserId === Number(user?.id) ? 'flex-end' : 'flex-start' }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor: message.fromUserId === Number(user?.id) ? 'primary.main' : 'grey.300',
                  color: message.fromUserId === Number(user?.id) ? 'white' : 'black',
                  borderRadius: 2,
                  maxWidth: '60%',
                }}
              >
                <ListItemText
                  primary={message.content}
                  secondary={new Date(message.createdAt).toLocaleString()}
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