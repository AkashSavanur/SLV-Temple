import React from "react";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tempClient } from "./Atoms"; // Update the path accordingly
import { Button } from "@mui/material";

const ClientButton = () => {
  const navigate = useNavigate();
  const [tempClientState, setTempClientState] = useRecoilState(tempClient);

  const handleClick = () => {
    setTempClientState((prevState) => !prevState); // Toggle the tempClient state
    console.log(tempClientState); // This might not show the updated state immediately due to the asynchronous nature of setState
    navigate("/dashboard");
  };

  return (
    <div className="client-pic">
      <Button
        color="warning"
        variant="contained"
        onClick={handleClick}
        style={{
        }}
        startIcon={<SwitchAccountIcon fontSize="large" />}
      >
        Switch Role
      </Button>
    </div>
  );
};

export default ClientButton;
