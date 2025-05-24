import React from 'react'
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/registered-users")
  };
  return (
    <div className='edit-user'>
        <h1>Edit User</h1>
        <Button onClick={handleClick}>Submit</Button>

    </div>
  )
}

export default EditUser