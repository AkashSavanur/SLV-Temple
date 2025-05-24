import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ProfileButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };
  return (
    <div className="profile-pic">
      <Button
        variant="contained"
        color="warning"
        onClick={handleClick}
        startIcon={<AccountCircleIcon fontSize="large"/>}
      >
        View Profile
      </Button>
      
    </div>
  );
};

export default ProfileButton;