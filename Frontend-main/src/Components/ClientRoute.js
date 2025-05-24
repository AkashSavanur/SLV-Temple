import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './Atoms';
import { Navigate, Route } from 'react-router-dom';

const ClientRoute = ({ children, route }) => {
  const currentUser = useRecoilValue(currentUserState);


  if (!currentUser?.auth_token) {
    if (route == "Adopt A Day"){
      console.log(route)
      return <Navigate to="/login?Route=/adopt-a-day-client" />;
    } else if (route == "Donate"){
      console.log(route)
      return <Navigate to="/login?Route=/donor-client" />;
    } else if (route == "Form"){
      console.log(route)
      return <Navigate to="/login?Route=/book-adopt-a-day" />;
    }
    else {
      console.log(route)
      return <Navigate to="/login?Route=/" />;
    }
  }
  return children;
};

export default ClientRoute;