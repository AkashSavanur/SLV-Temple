import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import YouTubeEmbed from "./YouTubeEmbed";
import useBreakpoints from "../Context/useBreakPoints";
import LandingNavBar from "./LandingNavBar";
import LandingNavBarMobile from "./LandingNavBarMobile";

export default function Gallery() {
  const { isSm } = useBreakpoints();
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div>
      {isSm ? <LandingNavBar /> : <LandingNavBarMobile />}
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
          padding: 4,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "white",
          overflowX: "hidden",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <h1 style={{ marginBottom: "1rem", color: "#ffffff" }}>
            Watch This 5 Minute Video:
          </h1>
          <YouTubeEmbed videoId="KqNcHpyMWpQ" />
        </Box>

        <center>
          <Box
            sx={{
              width: { xs: "100%", md: 1000 },
              height: "auto",
              overflowY: "scroll",
              boxShadow: 3,
              backgroundColor: "white",
              borderRadius: 1,
              padding: 2,
            }}
          >
            <ImageList variant="masonry" cols={3} gap={8}>
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}`}
                    alt={item.title}
                    loading="lazy"
                    style={{ borderRadius: "8px" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </center>
      </Box>
    </div>
  );
}

const itemData = [
  {
    img: "../img/Gallery/image1.jpeg",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];
