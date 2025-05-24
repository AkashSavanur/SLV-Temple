import { Button, Divider } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import logo from "../img/logo.png";
import { currentUserAtom } from "../App";
import Swal from "sweetalert2";

export default function LandingNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const handleClick = () => {
    navigate('/');
  }

  const getButtonStyle = (path) => {
    return location.pathname === path
      ? { ...styles.link, ...styles.activeLink }
      : styles.link;
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.leftSide}>
        <div style={styles.logoContainer}>
          <Button onClick={handleClick}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </Button>
        </div>
        <div style={styles.textContainer}>
          <div style={styles.title}>Sri Lakshmi Venkataramana Temple</div>
          <Divider />
          <div style={styles.bottomLeft}>
            <Button
              style={getButtonStyle("/donor-client")}
              onClick={() => navigate("/donor-client")}
            >
              DONATE NOW
            </Button>
            <Button
              style={getButtonStyle("/adopt-a-day-client")}
              onClick={() => navigate("/adopt-a-day-client")}
            >
              ADOPT A DAY
            </Button>

            {currentUser ? (
              <Button
                style={getButtonStyle("/dashboard")}
                onClick={() => navigate("/dashboard")}
              >
                {currentUser?.data?.roles?.isAdmin
                  ? "Administration"
                  : "Dashboard"}
              </Button>
            ) : null}
            <Button
              style={getButtonStyle("/gallery")}
              onClick={() => navigate("/gallery")}
            >
              GALLERY
            </Button>
            <Button
              style={getButtonStyle("/contact-us")}
              onClick={() => navigate("/contact-us")}
            >
              CONTACT US
            </Button>
            <Button
              style={getButtonStyle(currentUser ? "/logout" : "/login")}
              sx={{
                backgroundColor: '#f84402'
              }}
              variant="contained"
              onClick={async () => {
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
              }}
            >
              {currentUser ? "LOGOUT" : "LOGIN"}
            </Button>
          </div>
        </div>
      </div>
      <div style={styles.contact}>
        <span>
          Phone: <a href="tel:+917204213913">+91 72042 13913</a>
        </span>
        <br />
        <span>
          Email:{" "}
          <a href="mailto:slv.durga.temple@gmail.com">
            slv.durga.temple@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    height: "15vh",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  logoContainer: {
    width: "80px", // Adjust width as needed
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    maxWidth: "100%",
    maxHeight: "100%",
    height: "auto",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#ff6600",
  },
  bottomLeft: {
    display: "flex",
    marginTop: "5px",
  },
  link: {
    marginRight: "20px",
    textDecoration: "none",
    color: "black",
    fontSize: "16px",
    borderColor: "black",
  },
  activeLink: {
    fontWeight: "bold",
    color: "#ff6600",
  },
  contact: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "1.25rem",
  },
};
