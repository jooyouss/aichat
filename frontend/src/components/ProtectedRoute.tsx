import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { initializeAuth } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const validationAttempted = useRef(false);

  useEffect(() => {
    const validateAuth = async () => {
      if (!isAuthenticated && token && !isLoading && !validationAttempted.current) {
        validationAttempted.current = true;
        try {
          await dispatch(initializeAuth()).unwrap();
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      }
    };
    validateAuth();
  }, [dispatch, isAuthenticated, token, isLoading]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated && validationAttempted.current) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 