import React from 'react'
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/registered-users")
  };
  return (
    <div className='add-user'>
        <h1>Add User</h1>
        <Button onClick={handleClick}>Submit</Button>
    </div>
  )
}

export default AddUser