import React, { useState, useEffect } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { MuiTelInput } from "mui-tel-input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import Swal from "sweetalert2";
import { createMemoryHistory } from "history";
import useBreakpoints from "../Context/useBreakPoints";
import LandingNavBar from "./LandingNavBar";
import LandingNavBarMobile
from "./LandingNavBarMobile";
import { CircularProgress } from "@mui/material";
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const history = createMemoryHistory();
  const {isSm} = useBreakpoints()
  const [buttonLoading, setButtonLoading] = useState(false)

  const routeParam = new URLSearchParams(location.search).get(
    "Route"
  );

  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const ColorButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "rgb(251, 50, 38)",
    },
    width: "400px",
    padding: "10px",
    marginTop: "20px",
    fontSize: "large",
  }));

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard"); // Default path

  const handlePhoneNumberChange = (newValue) => {
    setPhoneNumber(newValue);
  };

  const handleResend = () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/otp/resend",
      data: {
        phone_number: phoneNumber,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        Swal.fire({
          icon: "success",
          text: response.data.confirmation_message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    setShowOtpInput(true);
  };

  const handleSendOtp = () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/otp/generate",
      data: {
        phone_number: phoneNumber,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        Swal.fire({
          icon: "success",
          text: response.data.confirmation_message
        })


      })
      .catch(function (error) {
        if (error.response && error.response.status === 403) {
          window.location.reload();
          alert(error.response.data.message);
        } else {
          window.location.reload();
          alert(error.response.data.message);
          console.error("Error validating OTP:", error);
        }
      });
    setShowOtpInput(true);
  };

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonLoading(true)

    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/otp/validate",
      data: {
        phone_number: phoneNumber,
        otp: parseInt(otp),
      },
    };

    try {
      const response = await axios.request(options);

      if (response.headers.auth_token) {
        const updatedUser = {
          ...currentUser,
          auth_token: response.headers.auth_token,
        };

        setCurrentUser(updatedUser);
        const path = routeParam || "/";
        navigate(path);
        localStorage.setItem("path", path);
        setButtonLoading(false)
      } else {
        throw new Error("Auth token not received");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
        window.location.reload();
      } else if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      } else {
        alert(error.response.data.message || error.message);
        console.error("Error validating OTP:", error);
        window.location.reload();
      }
    }
  };


  useEffect(() => {
    console.log("Current User state has changed:", currentUser);
  }, [currentUser]);

  return (
    <div>
      {isSm ? <LandingNavBar /> : <LandingNavBarMobile />}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh", // Ensure full viewport height
            backgroundColor: "#ffffff", // White background
            backgroundImage:
              "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))", // Gradient background
            boxSizing: "border-box",
            overflowX: 'hidden'
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#ffffff",
            }}
          >
            <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
              <h2>Login</h2>
            </Box>

            {!showOtpInput ? (
              <Box sx={{ marginBottom: "20px" }}>
                <MuiTelInput
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  fullWidth
                  defaultCountry="IN"
                />
                <Button
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={!phoneNumber}
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "rgb(247 148 52)",
                    color: "#fff",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "rgb(227 128 32)",
                    },
                  }}
                >
                  Send OTP
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/register");
                  }}
                  sx={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "rgb(18 131 10)",
                    color: "#fff",
                    marginTop: "10px",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "rgb(8 121 0)",
                    },
                  }}
                >
                  Click here if you are a new user
                </Button>
              </Box>
            ) : (
              <Box sx={{ marginBottom: "20px" }}>
                <MuiOtpInput
                  value={otp}
                  onChange={handleOtpChange}
                  length={6} // Set to 6-digit OTP input
                  separator={<span>-</span>}
                />
              </Box>
            )}
            {showOtpInput && (
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  disabled={buttonLoading}
                  onClick={(e) => handleLogin(e)}
                  sx={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: buttonLoading ? "#D3D3D3":"rgb(247 148 52)",
                    color: "#fff",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "rgb(227 128 32)",
                    },
                  }}
                >
                  {buttonLoading ? "Loading..." : "Login"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResend}
                  sx={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "rgb(30 28 125)",
                    marginTop: "10px",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "rgb(240 240 240)",
                    },
                  }}
                >
                  Resend OTP
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/register");
                  }}
                  sx={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "rgb(18 131 10)",
                    color: "#fff",
                    marginTop: "10px",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "rgb(8 121 0)",
                    },
                  }}
                >
                  Click here if you are a new user
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Login;