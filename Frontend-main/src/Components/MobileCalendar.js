import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Button, Skeleton, Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import axios from "axios";

export default function CalendarComponent({
  navigate,
  handleDateClick,
  showViewList,
  getBorderColor,
  getEventColor,
  isAvailable,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState({
    month: "",
    year: "",
  });

  const handleViewChange = (view) => {
    const startDate = view.view.currentStart;
    const month = dayjs(startDate).format("MM"); 
    const year = dayjs(startDate).format("YYYY"); 
    setCurrentDate(dayjs(startDate)); 
    setCurrentMonthYear({ month, year });
    console.log("View Changed:", month, year); 
  };

  useEffect(() => {
    console.log(currentDate);
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/getAll",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        year: currentMonthYear.year,
        month: currentMonthYear.month,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setBookings(response.data.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [currentDate]);

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
          occasion: booking.occasion,
        });
      } else {
        if (available) {
          events.push({
            title: "Open",
            start: dateStr,
            backgroundColor: "#7dd8ff",
            borderColor: "grey",
            bookingData: null, // No booking data for vacant dates
            occasion: null, // No occasion for vacant dates
          });
        }
      }

      current = current.add(1, "day");
    }

    return events;
  };
  const [info, setInfo] = useState({
    first_name: "",
    last_name: "",
    occasion: "",
    booking_status: "",
  });
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [selectedDate, setSelectedDate] = useState(null); // State to track the selected date

  const onDateClick = (info) => {
    const clickedDate = dayjs(info.dateStr).format("YYYY-MM-DD");
    const booking = bookings.find(
      (booking) => dayjs(booking.date).format("YYYY-MM-DD") === clickedDate
    );

    if (booking) {
      setShowInfo(true);
      setInfo({
        first_name: booking.user?.first_name,
        last_name: booking.user?.last_name,
        occasion: booking.occasion,
        booking_status:
          booking.booking_status !== "Available" ? "Booked" : null,
      });
      setSelectedDate(clickedDate); // Set the selected date
    } else {
      navigate(`/book-adopt-a-day?startDate=${clickedDate}`);
    }
  };

  const handleViewMount = (view) => {
    const startDate = view.view.activeStart;
    const month = dayjs(startDate).format("MMMM");
    const year = dayjs(startDate).format("YYYY");
    setCurrentMonthYear({ month, year });
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
    <div className="booking-calendar">
      <div className="calendar-container">
        <div>
          <h1>
            Adopt A Day Calendar{" "}
            {currentUser?.data?.roles?.isAdmin && showViewList && (
              <Button
                variant="contained"
                onClick={() => navigate("/adopt-a-day/bookings")}
                style={{
                  backgroundColor: "purple",
                  position: "fixed",
                  top: "0",
                  right: "0",
                  margin: "10px",
                }}
              >
                View List
              </Button>
            )}
          </h1>
          <h2
            style={{ color: "#444", fontSize: "1.5em", fontWeight: "normal" }}
          >
            {currentMonthYear.month} {currentMonthYear.year}
          </h2>

          <h2>Click on a date to make a booking</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
              margin: "10px",
              color: "#333",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
              }}
            >
              <HourglassEmptyOutlinedIcon
                style={{ color: "orange", height: "20px", marginRight: "8px" }}
              />
              <span>Pending</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "#333",
                  borderRadius: "50%",
                  margin: "0 8px",
                }}
              />
              <CheckCircleOutlineOutlinedIcon
                style={{ color: "green", height: "20px", marginRight: "8px" }}
              />
              <span>Booked</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "#333",
                  borderRadius: "50%",
                  margin: "0 8px",
                }}
              />
              <EventAvailableOutlinedIcon
                style={{ color: "#485dff", height: "20px", marginRight: "8px" }}
              />
              <span>Available</span>
            </div>
          </div>
        </div>
        {bookings ? (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={generateEvents()}
            dateClick={onDateClick} // Use the onDateClick handler
            datesSet={handleViewChange}
            buttonText={{
              today: "Month",
              year: "Year",
            }}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "prevYear,nextYear",
            }}
            locale="en"
            style={{
              height: "100vh",
              backgroundColor: "rgb(255, 248, 231)",
            }}
            eventContent={(eventInfo) =>
              !isLoading ? (
                <div
                  style={{
                    height: "20px",
                    backgroundColor:
                      selectedDate ===
                      dayjs(eventInfo.event.start).format("YYYY-MM-DD")
                        ? "yellow"
                        : "transparent", // Highlight the selected date
                  }}
                  onClick={() => {
                    setShowInfo(true);
                    if (
                      eventInfo.event.extendedProps.bookingData
                        ?.booking_status === "completed" ||
                      eventInfo.event.extendedProps.bookingData
                        ?.booking_status === "booked" ||
                      eventInfo.event.extendedProps.bookingData
                        ?.booking_status === "pending"
                    ) {
                      setInfo({
                        first_name:
                          eventInfo.event.extendedProps.bookingData.user
                            ?.first_name,
                        last_name:
                          eventInfo.event.extendedProps.bookingData.user
                            ?.last_name,
                        occasion:
                          eventInfo.event.extendedProps.bookingData?.occasion,
                        booking_status:
                          eventInfo.event.extendedProps.bookingData
                            ?.booking_status,
                      });
                    } else if (eventInfo.event._def.title === "Open") {
                      navigate(
                        `/book-adopt-a-day?startDate=${dayjs(
                          eventInfo.event.start
                        ).format("YYYY-MM-DD")}`
                      );
                    }
                  }}
                >
                  <Box style={{ textAlign: "center" }}>
                    {eventInfo.event.extendedProps.bookingData
                      ?.booking_status === "pending" && (
                      <HourglassEmptyOutlinedIcon
                        style={{
                          color: "orange",
                          height: "20px",
                        }}
                      />
                    )}
                    {eventInfo.event.extendedProps.bookingData
                      ?.booking_status === "completed" && (
                      <CheckCircleOutlineOutlinedIcon
                        style={{
                          color: "green",
                          height: "20px",
                        }}
                      />
                    )}
                    {!eventInfo.event.extendedProps.bookingData
                      ?.booking_status && (
                      <EventAvailableOutlinedIcon
                        style={{
                          color: "#485dff",
                          height: "20px",
                        }}
                      />
                    )}
                  </Box>
                </div>
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={210}
                  height={30}
                  sx={{ bgcolor: "grey.200" }} // Custom background color
                />
              )
            }
          />
        ) : (
          <p>loading...</p>
        )}
      </div>
      <div>
        <center></center>
        <div style={{ textAlign: "center" }}>
          {showInfo && info ? (
            <div
              style={{
                backgroundColor: "white",
                margin: "10px",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ddd",
                width: "90%",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                Status:{" "}
                {info.booking_status === "completed" ? "Booked" : "Pending"}
              </h3>
              <p>
                <strong>Sponsor:</strong> {info.first_name} {info.last_name}
              </p>
              <p>
                <strong>Occasion:</strong> {info.occasion}
              </p>
            </div>
          ) : (
            <h3>Click on a date to Adopt a Day</h3>
          )}
        </div>
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
          text-align: center;
        }
        .event-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100px; /* Adjust width as needed */
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
          background-color: green;
          color: white;
          border: none;
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
