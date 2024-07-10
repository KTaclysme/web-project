import { io, Socket } from 'socket.io-client';

let sockets: Socket | null = null;

export const initializeSockets = (userId: string) => {
  if (!userId) {
    console.error('User ID is not set in localStorage');
    return;
  }

  sockets = io(import.meta.env.VITE_BACKEND, {
    query: {
      userId: userId,
    },
  });
};

export const getSockets = (): Socket | null => sockets;