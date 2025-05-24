import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  TextField,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Typography,
  Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BookingsTable from "./BookingsTable";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentUserAtom } from "../App";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2"; // Import SweetAlert
import useBreakpoints from "../Context/useBreakPoints";

const Bookings = () => {
  const navigate = useNavigate();
  const { isSm } = useBreakpoints();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [bookings, setBookings] = useState(null);
  const [bookingsYear, setBookingsYear] = useState(null);
  const [editId, setEditId] = useState(null);
  const [bookingToUpdate, setBookingToUpdate] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");
  const [search, setSearch] = useState("");
  const [column, setColumn] = useState("first_name");
  const [csvLoading, setCsvLoading] = useState(false)

  // Pagination logic
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, totalRows - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    console.log("page changed", newPage); //works
    setPage(newPage);
    setBookings(null)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [formData, setFormData] = useState({
    user_id: "",
    date: "",
    booking_status: "",
    relationship_id: "",
    transaction_id: "",
    transaction_mode: "",
    transaction_details_receipt_url: "",
    transaction_details_cheque_number: "",
    transaction_details_bank_name: "",
    transaction_details_payment_date: "",
    recipient_name: "",
    occasion: "",
  });

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name: "created_at",
          isAscending: true,
        },
        search: {
          column_name: column,
          search_term: search,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setBookings(response.data.data);
        setRates(response.data.rate_id);
        setCurrentPage(response.data.current_page);
        setTotalRows(response.data.total_rows);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [page, rowsPerPage, order, orderBy, column, search]);

  const fetchBookings = async () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name:
            orderBy == "first_name" || orderBy == "last_name"
              ? `user.${orderBy}`
              : orderBy,
          isAscending: order == "asc" ? true : false,
        },
        search: {
          column_name: column,
          search_term: search,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setBookings(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalRows(response.data.total_rows);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const handleUpdate = async () => {
    const options = {
      method: "PUT",
      url: `https://api.kiruthirupathi.org/adoptaday/update/${editId}`,
      headers: { Authorization: currentUser?.auth_token },
      data: {
        user_id: bookingToUpdate.user_id,
        date: formData.date,
        booking_status: formData.booking_status,
        relationship_id: formData.relationship_id,
        transaction: {
          id: formData.transaction_id,
          mode: formData.transaction_mode,
          details: {
            receipt_url: formData.transaction_details_receipt_url,
            cheque_number: formData.transaction_details_cheque_number,
            bank_name: formData.transaction_details_bank_name,
            payment_date: formData.transaction_details_payment_date,
          },
        },
        recipient_name: formData.recipient_name,
        occasion: formData.occasion,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Booking updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // Fetch the updated bookings
      fetchBookings();

      // Reset the form
      resetForm();
    } catch (error) {
      console.error(error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error updating booking",
        text: "There was an issue updating the booking. Please try again later.",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (booking) => {
    scrollToTop();
    setBookingToUpdate(booking);
    setEditId(booking.id);
    setFormData({
      user_id: booking.user.id,
      date: booking.date,
      booking_status: booking.booking_status,
      relationship_id: booking.relationship_id,
      transaction_id: booking.transaction.id,
      transaction_mode: booking.transaction.mode,
      transaction_details_receipt_url: booking.transaction.details.receipt_url,
      transaction_details_cheque_number:
        booking.transaction.details.cheque_number,
      transaction_details_bank_name: booking.transaction.details.bank_name,
      transaction_details_payment_date:
        booking.transaction.details.payment_date,
      recipient_name: booking.recipient_name,
      occasion: booking.occasion,
    });
  };

  const handleDelete = async (id) => {
    const bookingToDelete = bookings.find((booking) => booking.id === id);
    const confirmation = prompt(
      `To confirm deletion, type "delete ${bookingToDelete.user.first_name} ${bookingToDelete.user.last_name}"`
    );

    if (
      confirmation ===
      `delete ${bookingToDelete.user.first_name} ${bookingToDelete.user.last_name}`
    ) {
      const currentDate = new Date().toISOString();
      const updatedBooking = {
        ...bookingToDelete,
        deletedAt: currentDate, // Ensure correct property name 'deletedAt'
      };

      try {
        const options = {
          method: "PUT",
          url: `https://api.kiruthirupathi.org/adoptaday/delete/${id}`,
          headers: { Authorization: currentUser?.auth_token },
        };

        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.error(error);
          });

        // setUsers(...users, response.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      Swal.fire({
        text: "Deletion cancelled. Please type 'delete' followed by the user's first name and last name to confirm deletion.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      start_date: "",
      end_date: "",
      booking_status: "",
      transaction_id: "",
      transaction_mode: "",
      transaction_details_receipt_url: "",
      transaction_details_cheque_number: "",
      transaction_details_bank_name: "",
      transaction_details_payment_date: "",
      recipient_name: "",
      occasion: "",
    });
    setEditId(null);
  };

  const handleClick1 = () => {
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [rates, setRates] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate();
  };

  const downloadCSV = () => {
    setCsvLoading(true)
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/csv",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        sort: {
          column_name:
            orderBy == "first_name" || orderBy == "last_name"
              ? `user.${orderBy}`
              : orderBy,
          isAscending: order == "asc" ? true : false,
        },
        search: {
          column_name: column,
          search_term: search,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const blob = new Blob([response.data], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "bookings.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setCsvLoading(false)
      })
      .catch(function (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate CSV',
        });
        setCsvLoading(false)
      });
  };

  const fetchYear = () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/getAll",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        year: new Date().getFullYear(),
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setBookingsYear(response.data.data.length);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchYear();
  }, []);

  return (
    <div
      className="bookings"
      style={{
        overflowX: "hidden",
      }}
    >
      <header className="header">
        <h1>Bookings List</h1>
        <HomeIcon className="home" fontSize="large" onClick={handleClick1} />
      </header>

      {editId && (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "8px",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <form>
            <FormControl fullWidth margin="normal">
              <InputLabel id="booking-status-label">Booking Status</InputLabel>
              <Select
                labelId="booking-status-label"
                name="booking_status"
                value={formData.booking_status || ""}
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="On behalf of"
              name="relationship_id"
              value={formData.relationship_id || ""}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Recipient Name"
              name="recipient_name"
              value={formData.recipient_name || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Occasion"
              name="occasion"
              value={formData.occasion || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Transaction ID"
              name="transaction_id"
              value={formData.transaction_id || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Transaction Mode"
              name="transaction_mode"
              value={formData.transaction_mode || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Receipt URL"
              name="transaction_details_receipt_url"
              value={formData.transaction_details_receipt_url || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Cheque Number"
              name="transaction_details_cheque_number"
              value={formData.transaction_details_cheque_number || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Bank Name"
              name="transaction_details_bank_name"
              value={formData.transaction_details_bank_name || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Payment Date"
              type="date"
              name="transaction_details_payment_date"
              value={formData.transaction_details_payment_date || ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Update Booking
            </Button>
          </form>
        </Box>
      )}
      <div
        style={{
          backgroundColor: "rgb(255, 248, 231)",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        {isSm ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", flexGrow: 1 }}>
              <TextField
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Column</InputLabel>
                <Select
                  style={{ marginLeft: "8px", minWidth: "120px" }}
                  value={column}
                  onChange={(e) => {
                    setColumn(e.target.value);
                    console.log("target value", e.target.value);
                  }}
                >
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="booking_status">Booking Status</MenuItem>
                  <MenuItem value="recipient_name">Recipient Name</MenuItem>
                  <MenuItem value="occasion">Occasion</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Button
                variant="contained"
                onClick={downloadCSV}
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  marginRight: "10px",
                }}
                startIcon={<DownloadIcon />}
                disabled={csvLoading}
              >
                {csvLoading ? "Downloading..." : "Download CSV"}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/adopt-a-day-client")}
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  backgroundColor: "purple",
                }}
              >
                View Calendar
              </Button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column", // Change to column for better mobile layout
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: "8px" }} // Add margin for spacing
              />
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Column</InputLabel>
                <Select
                  fullWidth
                  style={{ marginBottom: "8px" }} // Add margin for spacing
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                >
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="booking_status">Booking Status</MenuItem>
                  <MenuItem value="recipient_name">Recipient Name</MenuItem>
                  <MenuItem value="occasion">Occasion</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Change to column for better mobile layout
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                onClick={downloadCSV}
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  marginRight: "100%",
                  width: '100%'
                }}
                startIcon={<DownloadIcon />}
                disabled={csvLoading}
              >
                {csvLoading ? "Downloading..." : "Download CSV"}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/adopt-a-day-client")}
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  width: "100%",
                  backgroundColor: "purple",
                }}
              >
                View Calendar
              </Button>
            </div>
          </div>
        )}
        <h2>
          Number of Bookings This Year: {bookingsYear ? bookingsYear :
            <span>Counting...</span>
          }
        </h2>
        {" "}
        {/* Display the number of bookings */}
        <BookingsTable
          totalAmount={totalAmount}
          bookings={bookings}
          setBookings={setBookings}
          onDelete={handleDelete}
          onEdit={handleEdit}
          rates={rates}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          emptyRows={emptyRows}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalRows={totalRows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentUser={currentUser}
          setTotalRows={setTotalRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          fetchBookings={fetchBookings}
          column={column}
          search={search}
        />
      </div>

      <style jsx>{`
        /* Header styling */
        .header {
          background-image: linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0));
          width: 100%;
          padding-top: 50px;
          padding-bottom: 50px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }

        .header h1 {
          align-items: center;
          color: black;
        }

        /* Rest of
        /* Rest of the styling */
        .home {
          color: black;
          position: absolute;
          left: right;
          top: 20px;
          cursor: pointer;
        }

        .bookings {
          margin: 20px;
        }

        form {
          background-color: white
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;

        }

        form input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        form FormControl {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        .MuiButton-root {
          margin-top: 10px;
        }

        /* Table styling */
        .bookings-table {
          background-color: white
          margin-top: 20px;
          max-width: 100%;
          overflow-x: auto;
        }

        table {
          background-color: white
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }

        .edit-btn,
        .delete-btn {
          padding: 5px 10px;
          margin-right: 5px;
          cursor: pointer;
        }

        .edit-btn {
          background-color: #4caf50;
          color: white;
          border: none;
        }

        .delete-btn {
          background-color: #f44336;
          color: white;
          border: none;
        }

        /* Download button styling */
        .download-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Bookings;
