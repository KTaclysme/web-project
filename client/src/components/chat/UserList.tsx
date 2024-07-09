import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { List, ListItem, ListItemText, CircularProgress, Typography, Box } from '@mui/material';

interface UserListProps {
  onSelectUser: (userId: number) => void;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUser(user.username);
    }
  }, []);

  if (loading) return <Box sx={{ p: 2 }}><CircularProgress /></Box>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const filteredUsers = data.users.filter((user: { username: string }) => user.username !== currentUser);

  if (filteredUsers.length === 0) {
    return <Typography sx={{ p: 2 }}>Aucun utilisateur existant pour le moment !</Typography>;
  }

  return (
    <List>
      {filteredUsers.map((user: { id: number; username: string }) => (
        <ListItem button key={user.id} onClick={() => onSelectUser(user.id)}>
          <ListItemText primary={user.username} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;