import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { teal, grey} from '@mui/material/colors';

const DashboardButton = ({ title, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: grey[900],
    backgroundColor: teal[500],
    backgroundImage: 'linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))',
    '&:hover': {
      backgroundColor: teal[700],
    },
    width: '100%', // Full width within the flex item
    height: '100%', // Full height within the flex item
    fontSize: '28px',
    flex: '1 1 300px', // Flex properties for responsive design
  }));

  return (
    <div className="dashboard-button" onClick={handleClick}>
      <ColorButton>{title}</ColorButton>
    </div>
  );
};

export default DashboardButton;