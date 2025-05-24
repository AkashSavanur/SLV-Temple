// CommonProtectedRoute.js
import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './Atoms';
import { Navigate, Route } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const currentUser = useRecoilValue(currentUserState);

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (!currentUser?.data?.roles?.isAdmin) {
    return <Navigate to="/404" />;
  } else {
    return children;
  }
};

export default AdminRoute;
