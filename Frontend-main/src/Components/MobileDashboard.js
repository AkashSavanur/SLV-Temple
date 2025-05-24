import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import DashboardButton from "./DashboardButton";
import ProfileButton from "./ProfileButton";
import ClientButton from "./ClientButton";
import ContactUsButton from "./ContactUsButton";
import { currentUserState, tempClient } from "./Atoms";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import PaymentIcon from "@mui/icons-material/Payment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import { currentUserAtom } from "../App";
import { useNavigate } from "react-router-dom";
import CollectionsIcon from '@mui/icons-material/Collections';

const MobileDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [tempClientState, setTempClientState] = useRecoilState(tempClient);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const buttonStyles = {
    width: '80%'
  }

  useEffect(() => {
    if (currentUser?.auth_token) {
      const options = {
        method: "GET",
        url: "https://api.kiruthirupathi.org/user/me",
        headers: { Authorization: currentUser?.auth_token },
      };

      axios
        .request(options)
        .then((response) => {
          const updatedUser = {
            ...currentUser,
            data: response.data,
          };
          setCurrentUser(updatedUser);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const adminRoutes = [
    {
      title: "Manage Adopt A Day",
      path: "/adopt-a-day",
    },
    {
      title: "Donation Management",
      path: "/donor-management",
    },
    {
      title: "Manage Registered Users",
      path: "/registered-users",
    },
  ];

  const clientRoutes = [
    {
      title: "Adopt A Day Calendar",
      path: "/adopt-a-day-client",
    },
    { title: "Donate", path: "/donor-client", icon: <PaymentIcon /> },
    {
      title: "Adopt A Day",
      path: "/book-adopt-a-day",
    },
    {
      title: "My Relations",
      path: `/relationships/${currentUser?.data?.id}`,
    },
    {
      title: "My Bookings",
      path: "/profile/mybookings",
    },
    {
      title: "My Donations",
      path: "/profile/mydonations",
    },
  ];

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!isConfirmed) {
      return; // Exit function if not confirmed
    }
    setCurrentUser(null);
    localStorage.removeItem("path")
  };

  const handleHome = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "rgb(255, 248, 231)",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarOpen ? "200px" : "0px",
            transition: "width 0.3s ease",
            backgroundColor: "#fff",
            borderRight: "1px solid #ccc",
            overflowY: "auto",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1200,
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
            display: { xs: "block", md: "block" },
            // Added flex direction and padding
            flexDirection: "column",
            padding: "20px 0",
            marginTop: '2rem'
          }}
        >
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="left"
            marginLeft="0rem"
          >
            <Grid item>
              <Button
                color="warning"
                onClick={handleHome}
                variant="contained"
                startIcon={<HomeIcon />}
                style={buttonStyles}
              >
                Home
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="warning"
                onClick={() => {
                  navigate('/gallery')
                }}
                variant="contained"
                startIcon={<CollectionsIcon />}
                style={buttonStyles}
              >
                Gallery
              </Button>
            </Grid>
            <Grid item>
              <ProfileButton />
            </Grid>
            <Grid item>
              <ContactUsButton startIcon={<SwitchAccountIcon />} />
            </Grid>
            {currentUser?.data?.roles?.isAdmin && (
              <Grid item>
                <ClientButton startIcon={<SwitchAccountIcon />} />
              </Grid>
            )}
            <Grid item>
              <Button
                color="warning"
                onClick={handleLogout}
                variant="contained"
                style={buttonStyles}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="error"
                variant="text"
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
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="text"
                startIcon={<FacebookIcon />}
                sx={{
                  fontSize: "large",
                }}
              >
                FaceBook
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="text"
                startIcon={<InstagramIcon />}
                sx={{
                  fontSize: "large",
                }}
              >
                Instagram
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Sidebar Toggle Icon */}
        <IconButton
          color="inherit"
          aria-label="open sidebar"
          onClick={toggleSidebar}
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            top: "0px",
            left: "0px",
            zIndex: 1300,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            marginLeft: sidebarOpen ? "200px" : "0px",
            marginTop: "20px",
            transition: "margin-left 0.3s ease",
            paddingLeft: "1rem",
          }}
        >
          <header>
            {currentUser?.data?.roles?.isAdmin && !tempClientState ? (
              <h1 style={{ textAlign: "center", fontSize: "26px" }}>
                Admin Dashboard - Sri Lakshmi Venkataramana Temple
              </h1>
            ) : (
              <h1 style={{ textAlign: "center", fontSize: "26px" }}>
                Dashboard - Sri Lakshmi Venkataramana Temple
              </h1>
            )}
          </header>
          {/* Button Grid */}
          <Box
            className="button-grid-container"
            sx={{
              marginTop: "6rem",
              padding: "0 1rem",
            }}
          >
            <Grid container spacing={2}>
              {currentUser?.data?.roles?.isAdmin && !tempClientState
                ? adminRoutes.map((route) => (
                  <Grid item key={route.title} xs={12} sm={6} md={4}>
                    <DashboardButton
                      title={route.title}
                      path={route.path}
                      icon={route.icon}
                    />
                  </Grid>
                ))
                : clientRoutes.map((route) => (
                  <Grid item key={route.title} xs={12} sm={6} md={4}>
                    <DashboardButton
                      title={route.title}
                      path={route.path}
                      icon={route.icon}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Global Styles */}
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
            rgb(255, 255, 255),
            rgb(255, 255, 255)
          );
          width: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }

        header h1 {
          font-size: 2.5rem;
          color: #ff6600;
        }

        .button-grid-container {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        @media (max-width: 960px) {
          .button-grid-container {
            padding: 0; // Adjusted padding for smaller screens
          }
        }
      `}</style>
    </div>
  );
};

export default MobileDashboard;
