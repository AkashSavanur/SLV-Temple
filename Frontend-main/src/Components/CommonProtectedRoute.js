// CommonProtectedRoute.js
import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './Atoms';
import { Navigate, Route } from 'react-router-dom';

const CommonProtectedRoute = ({ children }) => {
  const currentUser = useRecoilValue(currentUserState);
  console.log(currentUser);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default CommonProtectedRoute;
