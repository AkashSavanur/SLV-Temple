import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import { Button, Skeleton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function CalendarComponent({
  navigate,
  handleDateClick,
  showViewList,
  getBorderColor,
  getEventColor,
  isAvailable
}) {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState({ month: "", year: "" });
  const [currentUser] = useRecoilState(currentUserAtom);

  
  const handleViewChange = (view) => {
    const startDate = view.view.currentStart;
    const month = dayjs(startDate).format("MM"); 
    const year = dayjs(startDate).format("YYYY"); 
    setCurrentDate(dayjs(startDate)); 
    setCurrentMonthYear({ month, year });
    console.log("View Changed:", month, year); 
  };

  useEffect(() => {
    if (currentMonthYear.month && currentMonthYear.year) {
      console.log("Fetching data for:", currentMonthYear.month, currentMonthYear.year);
      const options = {
        method: "POST",
        url: "https://api.kiruthirupathi.org/adoptaday/getAll",
        headers: { Authorization: currentUser?.auth_token },
        data: {
          year: currentMonthYear.year,
          month: currentMonthYear.month
        }
      };
      axios
        .request(options)
        .then(function (response) {
          setBookings(response.data.data);
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [currentMonthYear, currentUser?.auth_token]); // Depend on currentMonthYear

  const generateEvents = () => {
    const startDate = currentDate.startOf("month");
    const endDate = currentDate.endOf("month").add(5, "year");
    const events = [];

    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      const booking = bookings.find(
        (booking) => dayjs(booking.date).format("YYYY-MM-DD") === dateStr
      );

      const available = isAvailable(dateStr);

      if (booking) {
        events.push({
          title: !booking.relationship
            ? `${booking.user.first_name} ${booking.user.last_name}'s \n ${booking.occasion}`
            : `${booking.relationship?.details.first_name} ${booking.relationship?.details.last_name}'s \n ${booking.occasion}`,
          start: dateStr,
          backgroundColor: getEventColor(booking.booking_status),
          borderColor: getBorderColor(booking.booking_status),
          bookingData: booking,
          occasion: booking.occasion
        });
      } else {
        if (available) {
          events.push({
            title: "Open",
            start: dateStr,
            backgroundColor: "#7dd8ff",
            borderColor: "grey",
            bookingData: null,
            occasion: null
          });
        }
      }

      current = current.add(1, "day");
    }

    return events;
  };

  const handleClick = (info) => {
    localStorage.setItem(
      "path",
      `/book-adopt-a-day?startDate=${dayjs(info).format("YYYY-MM-DD")}`
    );
    navigate(`/book-adopt-a-day?startDate=${dayjs(info).format("YYYY-MM-DD")}`);
  };

  const handleClickHome = () => {
    navigate("/dashboard");
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [currentMonthYear]); // Depend on currentMonthYear

  return (
    <div className="booking-calendar" style={{ overflowX: "hidden" }}>
      {location.pathname === "/adopt-a-day-client" && (
        <HomeIcon
          className="home"
          sx={{ position: "fixed", left: "20px" }}
          fontSize="large"
          onClick={handleClickHome}
        />
      )}
      <div className="calendar-container">
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "8px"
          }}
        >
          <h1 style={{ color: "#000", fontSize: "2.5em", marginBottom: "10px" }}>
            Adopt a Day Calendar{" "}
            {currentUser?.data?.roles?.isAdmin && showViewList && (
              <Button
                variant="contained"
                onClick={() => navigate("/adopt-a-day/bookings")}
                style={{
                  backgroundColor: "purple",
                  position: "fixed",
                  top: "0",
                  right: "0",
                  margin: "10px"
                }}
              >
                View List
              </Button>
            )}
          </h1>
          <h2
            style={{ color: "#444", fontSize: "1.5em", fontWeight: "normal" }}
          >
            Click on a Date to Book
          </h2>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={generateEvents()}
          dateClick={handleDateClick}
          datesSet={handleViewChange} // Use the datesSet callback
          buttonText={{
            today: "Month",
            year: "Year"
          }}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: 'prevYear," ",nextYear'
          }}
          locale="en"
          style={{
            height: "100vh",
            backgroundColor: "rgb(255, 248, 231)"
          }}
          eventContent={(eventInfo) =>
              !isLoading ? (
              <div className="event-content">
                <div
                  className="event-label"
                  style={{
                    color: "black",
                    backgroundColor: eventInfo.event.backgroundColor,
                    borderColor: eventInfo.event.borderColor,
                    padding: "10px",
                    borderRadius: "5px"
                  }}
                >
                  {eventInfo.event.title.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  {eventInfo.event.extendedProps.bookingData && (
                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "0.9em",
                        color: "#555",
                        fontStyle: "italic"
                      }}
                    >
                      Status:{" "}
                      {eventInfo.event.extendedProps.bookingData.booking_status !==
                      "Available"
                        ? eventInfo.event.extendedProps.bookingData.booking_status ===
                          "completed"
                          ? "Booked"
                          : "Pending"
                        : null}
                    </div>
                  )}
                </div>
                {eventInfo.event.title === "Open" && (
                  <button
                    className="book-now-button"
                    onClick={() => handleClick(eventInfo.event.start)}
                  >
                    Adopt Now
                  </button>
                )}
              </div>
              ) : (<Skeleton
                variant="rectangular"
                width={200}
                height={50}
                animation="wave"
              />)
          }
        />
      </div>
      <style jsx>{`
        .booking-calendar {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .calendar-header {
          background: linear-gradient(
            to right,
            rgb(38, 179, 251),
            rgb(249, 178, 0)
          );
          color: black;
          text-align: center;
          padding: 10px;
          margin-bottom: 20px;
        }
        .calendar-container {
          margin: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background-color: white;
        }
        .event-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px; /* Adjust width as needed */
          text-align: center;
          padding: 10px;
        }
        .event-label {
          padding: 5px;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          margin-bottom: 5px;
          border-width: 1px;
          border-style: solid;
        }
        .book-now-button {
          background-color: lightblue;
          color: black;
          border: 1px solid black;
          padding: 8px 12px;
          margin-top: 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        @media (max-width: 768px) {
          .event-content {
            width: 150px; /* Adjust width for smaller screens */
          }
        }
      `}</style>
    </div>
  );
}
