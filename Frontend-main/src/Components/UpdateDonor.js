import { Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const UpdateDonor = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/donor-management")
  };
  return (
    <div className='update-donor'>
        <h1>Update Donor</h1>
        <Button onClick={handleClick}>Submit</Button>
    </div>
  )
}

export default UpdateDonor