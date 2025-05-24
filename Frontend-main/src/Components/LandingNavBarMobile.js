import React, { useState } from "react";
import { Button, Divider, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import logo from "../img/logo.png";
import { currentUserAtom } from "../App";

export default function LandingNavBarMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    if (currentUser) {
      const { isConfirmed } = await Swal.fire({
        text: "Are you sure you want to logout?",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

      if (!isConfirmed) {
        return;
      }
      setCurrentUser(null);
      localStorage.removeItem("path");
    } else {
      navigate("/login");
    }
  };

  const getButtonStyle = (path) => {
    return location.pathname === path
      ? { ...styles.link, ...styles.activeLink }
      : styles.link;
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.leftSide}>
        <Button onClick={handleClick} style={styles.title}>
          Sri Lakshmi Venkataramana Temple
        </Button>
        <Divider style={styles.divider} />
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleToggleMenu}
        >
          {isMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <Button style={getButtonStyle("/donor-client")} onClick={() => navigate("/donor-client")}>
            DONATE
          </Button>
          <Button style={getButtonStyle("/adopt-a-day-client")} onClick={() => navigate("/adopt-a-day-client")}>
            ADOPT A DAY
          </Button>
          {currentUser && (
            <Button style={getButtonStyle("/dashboard")} onClick={() => navigate("/dashboard")}>
              {currentUser?.data?.roles?.isAdmin ? "ADMINISTRATION" : "DASHBOARD"}
            </Button>
          )}
          <Button style={getButtonStyle("/gallery")} onClick={() => navigate("/gallery")}>
            GALLERY
          </Button>
          <Button style={getButtonStyle("/contact-us")} onClick={() => navigate("/contact-us")}>
            CONTACT US
          </Button>
          <Button style={getButtonStyle(currentUser ? "/logout" : "/login")} onClick={handleLogout}>
            {currentUser ? "LOGOUT" : "LOGIN"}
          </Button>
        </Collapse>
      </div>
      <div style={styles.contact}>
        <span>
          Phone: <a href="tel:+917204213913">+91 72042 13913</a>
        </span>
        <br />
        <span>
          Email:{" "}
          <a href="mailto:slv.durga.temple@gmail.com">slv.durga.temple@gmail.com</a>
        </span>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  logo: {
    width: "80px",
    height: "auto",
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff6600",
    marginBottom: "10px",
  },
  divider: {
    width: "80%",
    margin: "10px 0",
  },
  link: {
    margin: "5px 0",
    textDecoration: "none",
    color: "#fff",
    fontSize: "1rem",
    padding: "10px 20px",
    backgroundColor: "#ff6600",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  activeLink: {
    backgroundColor: "#ff3300",
    fontWeight: "bold",
  },
  contact: {
    textAlign: "center",
    fontSize: "1rem",
    marginTop: "10px",
  },
};
