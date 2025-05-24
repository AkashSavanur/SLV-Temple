import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DonationsTable from "./DonationsTable";
import HomeIcon from "@mui/icons-material/Home";
import { useRecoilState } from "recoil";
import { currentUserState } from "./Atoms";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import { currentUserAtom } from "../App";
import Swal from "sweetalert2"; // Import SweetAlert
import useBreakpoints from "../Context/useBreakPoints";


import {
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Window } from "@mui/icons-material";

const DonorManagementHome = () => {
  const API_URL = "https://api.kiruthirupathi.org/donation"; // Adjust API endpoint
  const navigate = useNavigate();
  const { isSm } = useBreakpoints();
  const currentUser = useRecoilState(currentUserAtom);
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [purposes, setPurposes] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false)

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/purposes/get",
      headers: { Authorization: currentUser.auth_token },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        setPurposes(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [currentUser.auth_token]);

  // Pagination logic
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, totalRows - page * rowsPerPage);

  //filtering logic
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");

  //searching logic
  const [search, setSearch] = useState("");
  const [collumn, setCollumn] = useState("recipient_name");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setDonations(null)
  };

  const handlePurposes = () => {
    navigate("/purposes");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [formData, setFormData] = useState({
    user_id: "",
    comments: "",
    purpose_id: "",
    amount: "",
    transaction_id: "",
    transaction_mode: "",
    receipt_url: "",
    cheque_number: "",
    bank_name: "",
    payment_date: "",
    recipient_name: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/donation/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name: "updated_at",
          isAscending: false,
        },
        search: {
          column_name: collumn,
          search_term: search,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setDonations(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalRows(response.data.total_rows);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [page, rowsPerPage, order, orderBy, collumn, search]); // Include currentUser.auth_token as dependency

  const fetchDonations = async () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/donation/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name:
            orderBy === "first_name" || orderBy === "last_name"
              ? `user.${orderBy}`
              : orderBy,
          isAscending: order === "asc",
        },
        search: {
          column_name: collumn,
          search_term: search,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setDonations(response.data.data);
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
      url: `https://api.kiruthirupathi.org/donation/update/${editId}`,
      headers: { Authorization: currentUser?.auth_token },
      data: {
        user_id: donations.user_id,
        comments: formData?.comments,
        amount: parseInt(formData?.amount),
        purpose_id: formData.purpose_id,
        transaction: {
          id: formData?.transaction_id,
          mode: formData?.transaction_mode,
          details: {
            receipt_url: formData?.receipt_url,
            cheque_number: formData?.cheque_number,
            bank_name: formData?.bank_name,
            payment_date: formData?.payment_date,
          },
        },
        recipient_name: formData?.recipient_name,
        status: formData?.status,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (donation) => {
    scrollToTop();
    setEditId(donation.id);
    const currentDate = new Date();
    setFormData({
      user_id: editId,
      comments: donation.comments,
      purpose_id: donation.purpose_id,
      amount: donation.amount,
      transaction_id: donation.transaction.id,
      transaction_mode: donation.transaction.mode,
      receipt_url: donation.transaction.details.receipt_url,
      cheque_number: donation.transaction.details.cheque_number,
      bank_name: donation.transaction.details.bank_name,
      payment_date: donation.transaction.details.payment_date,
      recipient_name: donation.recipient_name,
      status: donation.status,
      createdAt: donation.createdAt,
      updatedAt: currentDate,
      deletedAt: null,
    });
  };

  const handleDelete = async (id) => {
    const donationToDelete = donations.find((donation) => donation.id === id);
    const confirmation = prompt(
      `To confirm deletion, type "delete ${donationToDelete.user.first_name} ${donationToDelete.user.last_name}"`
    );

    if (
      confirmation ===
      `delete ${donationToDelete.user.first_name} ${donationToDelete.user.last_name}`
    ) {
      const currentDate = new Date().toISOString();
      const updatedDonation = {
        ...donationToDelete,
        deletedAt: currentDate, // Ensure correct property name 'deletedAt'
      };

      try {
        const options = {
          method: "DELETE",
          url: `https://api.kiruthirupathi.org/donation/delete/${id}`,
          headers: { Authorization: currentUser?.auth_token },
        };

        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            window.location.reload();
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

  const clearFormData = () => {
    setFormData({
      user_id: "",
      comments: "",
      purpose_id: "",
      amount: "",
      transaction_id: "",
      transaction_mode: "",
      receipt_url: "",
      cheque_number: "",
      bank_name: "",
      payment_date: "",
      recipient_name: "",
      status: "",
      createdAt: "",
      updatedAt: "",
      deletedAt: null,
    });
  };

  const handleClickHome = () => {
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(); // For editing existing donation
  };

  const downloadCSV = () => {
    setCsvLoading(true)
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/donation/csv",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        sort: {
          column_name:
            orderBy === "first_name" || orderBy === "last_name"
              ? `user.${orderBy}`
              : orderBy,
          isAscending: order === "asc",
        },
        search: {
          column_name: collumn,
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
          link.setAttribute("download", "donations.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setCsvLoading(false)
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  /* let total = 0;
  donations.map((donation) => (total = total + donation.amount)); */

  return (
    <div className="donor-management" style={{ overflowX: "hidden" }}>
      <header>
        <h1>Donation Management</h1>
      </header>
      <HomeIcon className="home" fontSize="large" onClick={handleClickHome} />

      <div
        style={{
          backgroundColor: "rgb(255, 248, 231)",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <center>
          {editId && (
            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: "20px",
                backgroundColor: "#f3f3f3",
                padding: "20px",
                borderRadius: "8px",
                display: "grid",
                gap: "10px",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                maxWidth: "800px",
              }}
            >
              <TextField
                label="Recipient Name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Transaction ID"
                name="transaction_id"
                value={formData.transaction_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Transaction Mode"
                name="transaction_mode"
                value={formData.transaction_mode}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Receipt URL"
                name="receipt_url"
                value={formData.receipt_url}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cheque Number"
                name="cheque_number"
                value={formData.cheque_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Bank Name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Payment Date"
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="purpose-label">Purpose</InputLabel>
                <Select
                  labelId="purpose-label"
                  name="purpose_id"
                  value={formData.purpose_id}
                  onChange={handleChange}
                >
                  {purposes && purposes.length > 0
                    ? purposes.map((purpose) => (
                      <MenuItem key={purpose.id} value={purpose.id}>
                        {purpose.name}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Update Donation
              </Button>
            </form>
          )}
        </center>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {/* <Typography variant="h6" style={{
            fontWeight: 'bold',
            fontSize: '24px',
            color: '#ff6600'
          }}>Total Amount Donated: Rs.{total}</Typography> */}
        </Box>
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
                    value={collumn}
                    onChange={(e) => {
                      setCollumn(e.target.value);
                      console.log("target value", e.target.value);
                    }}
                  >
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="recipient_name">Recipient Name</MenuItem>
                    <MenuItem value="purpose_id">Purpose</MenuItem>
                    <MenuItem value="first_name">First Name</MenuItem>
                    <MenuItem value="last_name">Last Name</MenuItem>
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
                  startIcon={<DownloadIcon />}
                  style={{ marginRight: "20px" }}
                  disabled={csvLoading}
                >
                  {csvLoading ? "Downloading..." : "Download CSV"}
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePurposes}
                  style={{ backgroundColor: "purple" }}
                >
                  View Purposes
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Adjusted for vertical stacking on mobile
                alignItems: "center",
                marginBottom: "2rem",
                padding: "0 20px", // Added padding for better mobile view
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
                  style={{ marginBottom: "8px" }} // Added margin for spacing
                />
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Column</InputLabel>
                  <Select
                    value={collumn}
                    onChange={(e) => setCollumn(e.target.value)}
                    style={{ marginBottom: "8px" }} // Added margin for spacing
                  >
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="recipient_name">Recipient Name</MenuItem>
                    <MenuItem value="purpose_id">Purpose</MenuItem>
                    <MenuItem value="first_name">First Name</MenuItem>
                    <MenuItem value="last_name">Last Name</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column", // Adjusted for vertical stacking on mobile
                  alignItems: "center",
                  width: "100%",
                }}
              >

                <Button
                  variant="contained"
                  onClick={downloadCSV}
                  startIcon={<DownloadIcon />}
                  style={{ marginBottom: "8px", width: "100%" }}
                  disabled={csvLoading}
                >
                  {csvLoading ? "Downloading..." : "Download CSV"}
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePurposes}
                  style={{ backgroundColor: "purple", width: "100%" }} // Full width
                >
                  View Purposes
                </Button>
              </div>
            </div>
          )}
          <DonationsTable
            donations={donations}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            emptyRows={emptyRows}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={totalRows}
            currentPage={currentPage}
            setDonations={setDonations}
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
            setTotalRows={setTotalRows}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            fetchDonations={fetchDonations}
          />
        </div>
      </div>
    </div>
  );
};

export default DonorManagementHome;
