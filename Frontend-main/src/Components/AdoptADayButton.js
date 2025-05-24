import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';

const AdoptADayButton = ({ title, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path)
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
    width: '300px',
    height: '200px',
    fontSize: '28px'
  }));

  return (
    <div className="adopt-a-day-button" onClick={handleClick}>
      <ColorButton size='large'>{title}</ColorButton>
    </div>
  );
};

export default AdoptADayButton;
