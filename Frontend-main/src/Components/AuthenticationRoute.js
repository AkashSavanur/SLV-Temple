// CommonProtectedRoute.js
import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './Atoms';
import { Navigate, Route } from 'react-router-dom';

const AuthenticationRoute = ({ children }) => {
  const currentUser = useRecoilValue(currentUserState);

  if (currentUser) {
    if (localStorage.getItem("path")) {
      return <Navigate to= {localStorage.getItem("path")} />;
    }
    else {
      return <Navigate to= "/" />;
    }
    
    
  } 
  return children;
};

export default AuthenticationRoute;