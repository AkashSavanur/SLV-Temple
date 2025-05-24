import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";
import { MuiTelInput } from "mui-tel-input";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useSetRecoilState, useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { currentUserAtom } from "../App";
import LandingNavBar from "./LandingNavBar";
import LandingNavBarMobile from "./LandingNavBarMobile";
import useBreakpoints from "../Context/useBreakPoints";

const theme = createTheme();

const Register = () => {
  const { isSm } = useBreakpoints()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState();

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
          text: response.data.confirmation_message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    setShowOtpInput(true);
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
  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/user/register",
      data: {
        phone_number: phoneNumber,
        otp: parseInt(otp),
        first_name: firstName,
        last_name: lastName,
        roles: {
          isAdmin: false,
          isDonor: false,
          isAdoptor: false,
        },
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
        navigate("/dashboard");
      } else {
        console.error("Auth token not received");
      }
    } catch (error) {
      if (error.response.status === 500) {
        Swal.fire({
          text: "Phone number already exists",
          icon: "error",
        });
      } else if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      }
      console.error("Error validating OTP:", error);
    }
  };

  return (
    <div>
      {isSm ? <LandingNavBar /> : <LandingNavBarMobile />}
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />


          <Box
            sx={{
              marginTop: theme.spacing(8),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: theme.spacing(4),
              borderRadius: theme.spacing(2),
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >

            <Box sx={{ marginBottom: theme.spacing(2) }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: theme.spacing(2) }}
            >
              Register
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: theme.spacing(1) }}
              onSubmit={handleRegister}
            >
              {!showOtpInput ? (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <MuiTelInput
                    fullWidth
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    margin="normal"
                    label="Phone Number"
                  />
                  <Box mt={2}>
                    {!firstName || !lastName || !phoneNumber ? (
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          Swal.fire({
                            text: "All fields are required",
                            icon: "error"
                          })
                        }}

                      >
                        Send OTP
                      </Button>
                    ) : (

                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </Button>
                    )}
                  </Box>
                </>
              ) : (
                <Box mt={2}>
                  <MuiOtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    length={6}
                    separator={<span>-</span>}
                  />
                </Box>
              )}
              {showOtpInput && (
                <Box mt={2}>
                  <Button
                    type="submit" // Changed to "submit" to handle form submission
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Register
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
                </Box>
              )}
                <Grid item>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      navigate('/login')
                    }}
                    style={{
                      marginTop: "5px"
                    }}
                  >
                    Already have an account?
                  </Button>
                </Grid>
            </Box>
          </Box>
          <Box mt={5} sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {"Copyright ©️ "}
              <Link color="inherit" href="https://www.linkedin.com/in/akash-savanur-395148196">
                Akash Savanur
              </Link>{" & "}
              <Link color="inherit" href="https://www.linkedin.com/in/sanjay-marathe-2257811b0">
                Sanjay Marathe
              </Link>{" "}
              {new Date().getFullYear()}
              {"."}
            </Typography>
          </Box>

        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Register;