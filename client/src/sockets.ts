import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId');

if (!userId) {
  console.error('User ID is not set in localStorage');
}

const sockets = io('http://localhost:3005', {
  query: {
    userId: userId,
  },
});

export default sockets;