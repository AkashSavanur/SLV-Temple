import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Swal from "sweetalert2";
import useBreakpoints from "../Context/useBreakPoints";
import LandingNavBar from "./LandingNavBar";
import LandingNavBarMobile from "./LandingNavBarMobile";

const ContactUs = () => {
  const { isSm } = useBreakpoints();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  const handleClick = () => {
    navigate("/dashboard");
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_47d9vgi",
        "template_i764wbc",
        form.current,
        "T-Mrf-HKduN8T0vwj"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
          Swal.fire("Success!", "Your message has been sent.", "success");
          e.target.reset();
        },
        (error) => {
          console.log(error.text);
          Swal.fire(
            "Error!",
            "There was an issue sending your message.",
            "error"
          );
        }
      );
  };

  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      {isSm ? <LandingNavBar /> : <LandingNavBarMobile />}

      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          width: "100%", // Ensure the Box takes full width
          backgroundColor: "rgb(255, 248, 231)",
        }}
      >
        <Box
          component="form"
          ref={form}
          onSubmit={sendEmail}
          sx={{
            width: "100%", // Ensure the form takes full width
            maxWidth: "800px", // Set a max width for better readability on large screens
            mt: -5, // Move the form up
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            We'd love to hear from you!
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="text"
                required
                fullWidth
                id="user_name"
                label="Name"
                name="user_name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="user_email"
                label="Email"
                name="user_email"
                type="email"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="message"
                label="Message"
                name="message"
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            sx={{ mt: 3 }}
          >
            Send Message
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            marginTop: "1rem",
          }}
        >
          <Button
            color="primary"
            variant="text"
            startIcon={<LocalPhoneIcon />}
            sx={{
              fontSize: "large",
              textTransform: "lowercase",
            }}
          >
            +91 72042 13913
          </Button>
          <Button
            color="primary"
            variant="text"
            startIcon={<EmailIcon />}
            sx={{
              fontSize: "large",
              textTransform: "lowercase",
            }}
          >
            slv.durga.temple@gmail.com
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
            marginBottom: "1rem",
            paddingBottom: "1rem",
            marginTop: "0rem",
          }}
        >
          <Button
            color="error"
            variant="text"
            size="small"
            startIcon={<YouTubeIcon />}
            sx={{
              fontSize: "large",
            }}
          >
            <a
              href="https://www.youtube.com/@srilaxmivenkataramanatemple"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              YouTube
            </a>
          </Button>
          <Button
            color="primary"
            variant="text"
            size="small"
            startIcon={<FacebookIcon />}
            sx={{
              fontSize: "large",
            }}
          >
            FaceBook
          </Button>
          <Button
            color="secondary"
            variant="text"
            size="small"
            startIcon={<InstagramIcon />}
            sx={{
              fontSize: "large",
            }}
          >
            Instagram
          </Button>
        </Box>
      </Box>

      <style jsx>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-image: linear-gradient(
            to right,
            rgb(38, 179, 251),
            rgb(249, 178, 0)
          );
        }

        header {
          background-image: linear-gradient(
            to right,
            rgb(38, 179, 251),
            rgb(249, 178, 0)
          );
          width: 100%;
          padding: 20px 0;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }

        header h1 {
          font-size: 2rem;
          color: white;
        }

        .header {
          width: 100%;
        }

        .bg {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background-color: rgb(255, 248, 231);
        }

        .MuiTextField-root {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
