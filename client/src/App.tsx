import React, { useEffect } from 'react';
import { ApolloProvider, useApolloClient } from '@apollo/client';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import client from './apollo-client';
import './App.css';

const App: React.FC = () => {
  const apolloClient = useApolloClient();

  useEffect(() => {
    const handlePageRefresh = () => {
      apolloClient.clearStore();
    };

    window.addEventListener('beforeunload', handlePageRefresh);

    return () => {
      window.removeEventListener('beforeunload', handlePageRefresh);
    };
  }, [apolloClient]);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;