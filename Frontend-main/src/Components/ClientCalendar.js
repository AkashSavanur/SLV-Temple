import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://https://13.233.148.9:3502/bookings";

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const navigate = useNavigate();

  const isBeforeToday = day.isBefore(dayjs(), 'day');
  const highlightedDay = highlightedDays.find((highlightedDay) =>
    dayjs(highlightedDay.date).isSame(day, 'day')
  );

  let badgeColor;
  if (outsideCurrentMonth) {
    badgeColor = 'transparent';
  } else if (highlightedDay) {
    badgeColor = highlightedDay.status === 'pending' ? 'yellow' :
              highlightedDay.status === 'booked' ? 'red' : 'green';
  } else if (!isBeforeToday && !outsideCurrentMonth) {
    badgeColor = 'green';
  }

  const handleDayClick = () => {
    navigate('/book-adopt-a-day');
  };

  const isDisabled = highlightedDay && (highlightedDay.status === 'pending' || highlightedDay.status === 'booked');

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent=" "
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: badgeColor,
          width: 8,
          height: 8,
          fontSize: 8,
        },
      }}
      onClick={!isDisabled ? handleDayClick : undefined}
      style={{ cursor: isDisabled ? 'default' : 'pointer' }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        disabled={isBeforeToday || isDisabled}
        sx={{
          fontWeight: 'bold',
        }}
      />
    </Badge>
  );
}

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const requestAbortController = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        const listBookings = await response.json();
        setBookings(listBookings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const daysToHighlight = bookings.map(booking => ({
      date: dayjs(booking.date),
      status: booking.booking_status,
    }));
    setHighlightedDays(daysToHighlight);
  }, [bookings]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    fetchHighlightedDays(date);
  };

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    requestAbortController.current = controller;

    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_URL}?month=${date.month() + 1}&year=${date.year()}`, {
          signal: controller.signal,
        });
        const listBookings = await response.json();
        const daysToHighlight = listBookings.map(booking => ({
          date: dayjs(booking.date),
          status: booking.booking_status,
        }));
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    };

    fetchItems();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="booking-calendar">
        <DateCalendar
          defaultValue={dayjs()}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
          sx={{
            '& .MuiPickersCalendarHeader-root': {
              fontWeight: 'bold',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontWeight: 'bold',
            },
            '& .MuiDayCalendar-monthContainer': {
              fontWeight: 'bold',
            },
          }}
        />
      </div>
      <style jsx>{`
        /* Reset default margin and font-family */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-image: linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0));
        }

        /* Code styling */
        code {
          font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
        }

        /* Calendar container */
        .booking-calendar {
          max-width: 320px;
          max-height: 500px;
          margin: 0 auto;
          background-color: rgb(255, 248, 231);
          font-weight: bolder;
        }

        /* MuiPickers styles */
        .MuiPickersCalendarHeader-root,
        .MuiDayCalendar-weekDayLabel,
        .MuiDayCalendar-monthContainer {
          font-weight: bold;
        }
      `}</style>
    </LocalizationProvider>
  );
}
