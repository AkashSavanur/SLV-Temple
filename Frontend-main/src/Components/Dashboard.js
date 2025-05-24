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
import ComputerDashboard from "./ComputerDashboard";
import useBreakpoints from "../Context/useBreakPoints";
import MobileDashboard from "./MobileDashboard";



import axios from "axios";

import { currentUserAtom } from "../App";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const { isSm } = useBreakpoints();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [tempClientState, setTempClientState] = useRecoilState(tempClient);

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

  return isSm ? (
    <ComputerDashboard/>
  ) : (
    <MobileDashboard/>
  );
};

export default Dashboard;
