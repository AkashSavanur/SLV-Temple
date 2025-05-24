import React, { useEffect } from "react";
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
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentIcon from "@mui/icons-material/Payment";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import HomeIcon from "@mui/icons-material/Home";
import Swal from "sweetalert2";
import CollectionsIcon from '@mui/icons-material/Collections';

import axios from "axios";

import { currentUserAtom } from "../App";
import { useNavigate } from "react-router-dom";

const ComputerDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [tempClientState, setTempClientState] = useRecoilState(tempClient);

  const buttonStyles = {
    width: '80%'
  }

  useEffect(() => {
    if (currentUser?.auth_token) {
      const options = {
        method: "GET",
        url: "https://api.kiruthirupathi.org/user/me",
        headers: { Authorization: currentUser.auth_token },
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

  return (
    <div className="bg">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          backgroundColor: "rgb(255, 248, 231)",
        }}
      >
        {/* Vertical Navbar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "white",
            width: "200px",
            height: "100%",
            position: "fixed",
            left: 0,
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="left"
            marginLeft="1rem"
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
                style={buttonStyles}
                startIcon={<CollectionsIcon />}
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
              <Grid item >
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
                Facebook
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

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            marginLeft: "200px", // Adjust this to match the width of the sidebar
          }}
        >
          <header>
            {currentUser?.data?.roles?.isAdmin && !tempClientState ? (
              <h1>Admin Dashboard - Sri Lakshmi Venkataramana Temple</h1>
            ) : (
              <h1>My Dashboard - Sri Lakshmi Venkataramana Temple</h1>
            )}
          </header>
          {/* Button Grid */}
          <Box
            className="button-grid-container"
            sx={{
              marginTop: "1rem",
            }}
          >
            <Box className="button-grid">
              {currentUser?.data?.roles?.isAdmin && !tempClientState ? (
                adminRoutes.map((route) => (
                  <DashboardButton
                    key={route.title}
                    title={route.title}
                    path={route.path}
                    icon={route.icon}
                  />
                ))
              ) : (
                <div>
                  <div className="button-grid">
                    {clientRoutes.slice(0, 3).map((route) => (
                      <DashboardButton
                        key={route.title}
                        title={route.title}
                        path={route.path}
                        icon={route.icon}
                      />
                    ))}
                  </div>
                  <div className="button-grid">
                    {clientRoutes.slice(3, 6).map((route) => (
                      <DashboardButton
                        key={route.title}
                        title={route.title}
                        path={route.path}
                        icon={route.icon}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Box>
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
          color: #ff6600
        }

        .button-grid-container {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 1200px;
        }

        .dashboard-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: background-color 0.3s ease;
          color: black; /* Set text color to black */
        }

        .dashboard-button:hover {
          background-color: #fbcf90;
        }

        .dashboard-button .icon {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .dashboard-button .title {
          font-size: 1.2rem;
          font-weight: bold;
        }

        @media (max-width: 600px) {
          .dashboard-button {
            flex: 1 1 50%;
          }
        }

        .MuiBadge-badge {
          width: 10px !important;
          height: 10px !important;
          font-size: 10px !important;
        }

        .MuiPickersStaticWrapper-staticWrapperRoot {
          max-width: 800px;
          max-height: 800px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );

  
};

export default ComputerDashboard;
