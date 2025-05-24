import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Button from "@mui/material/Button";

const HomeButton = ({ title, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard")
  };

  return (
    <div className="home-button" onClick={handleClick}>
      <Button>{title}</Button>
    </div>
  );
};

export default HomeButton;
