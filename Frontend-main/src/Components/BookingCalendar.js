import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/en";
import { currentUserAtom } from "../App";
import { useRecoilState } from "recoil";
import useBreakpoints from "../Context/useBreakPoints";
import MobileBookingCalendar from "./MobileCalendar";
import CalendarComponent from "./CalendarComponent";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/material";

dayjs.locale("en");

const BookingCalendar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { isSm } = useBreakpoints();

  

  const getEventColor = (status) => {
    switch (status) {
      case "completed":
        return "#77DD77";
      case "booked":
        return "#77DD77";
      case "pending":
        return "#FFD700";
      default:
        return "#77DD77";
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case "booked":
        return "#66BB66";
      case "completed":
        return "#66BB66";
      case "pending":
        return "#E5C100";
      default:
        return "#66BB66";
    }
  };

  const isAvailable = (dateStr) => {
    const currentDate = dayjs(dateStr);
    return (
      currentDate.isAfter(dayjs(), "day") &&
      !bookings.some(
        (booking) => dayjs(booking.date).format("YYYY-MM-DD") === dateStr
      )
    );
  };

  const handleDateClick = (arg) => {
    console.log("Date clicked:", arg.dateStr);
    navigate(`/book-adopt-a-day`);
  };

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handlePrevYear = () => {
    setCurrentDate(currentDate.subtract(1, "year"));
  };

  const handleNextYear = () => {
    setCurrentDate(currentDate.add(1, "year"));
  };

  const showViewList = location.pathname === "/adopt-a-day-client";

  return bookings? (
    isSm? (
      <CalendarComponent
        navigate={navigate}
        handleDateClick={handleDateClick}
        showViewList={showViewList}
        getBorderColor = {getBorderColor}
        getEventColor = {getEventColor}
        isAvailable = {isAvailable}
      />
    ) : (
      <MobileBookingCalendar
        navigate={navigate}
        handleDateClick={handleDateClick}
        showViewList={showViewList}
        getBorderColor = {getBorderColor}
        getEventColor = {getEventColor}
        isAvailable = {isAvailable}
      />
    )
  ) : (
    <Box sx={{
      textAlign: 'center'
    }}>
      <CircularProgress />
      <Typography variant="h5">Loading Bookings Calendar</Typography>
    </Box>
  );
  
};

export default BookingCalendar;
