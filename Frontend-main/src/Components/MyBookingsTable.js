import React from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, grey } from "@mui/material/colors";
import { useEffect } from "react";

const MyBookingsTable = ({
  totalAmount,
  bookings,
  setBookings,
  onDelete,
  onEdit,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  totalRows,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  setCurrentPage,
  setTotalRows,
  currentUser,
  fetchBookings,
  column,
  search,
}) => {
  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, order, orderBy, column, search]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(order);
  };

  const isDateInPast = (date) => {
    const today = new Date();
    return new Date(date) < today;
  };

  const handleDownloadPDF = async (pdfUrl, fileName) => {
    try {
      const response = await axios.get(pdfUrl, {
        responseType: "blob", // Ensure response type is blob
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "document.pdf"); // Set default filename if not provided
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally revoke the URL to free up memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error as needed
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "first_name" ? order : false}>
              <TableSortLabel
                active={orderBy === "first_name"}
                direction={orderBy === "first_name" ? order : "asc"}
                onClick={() => handleRequestSort("first_name")}
              >
                First Name
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "last_name" ? order : false}>
              <TableSortLabel
                active={orderBy === "last_name"}
                direction={orderBy === "last_name" ? order : "asc"}
                onClick={() => handleRequestSort("last_name")}
              >
                Last Name
              </TableSortLabel>
            </TableCell>
            <TableCell>On Behalf Of</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Nakshatra</TableCell>
            <TableCell>Rashi</TableCell>
            <TableCell>Gothra</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Booking Status</TableCell>
            <TableCell>Transaction Amount</TableCell>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Transaction Mode</TableCell>
            <TableCell>Receipt URL</TableCell>
            <TableCell>Receipt Number</TableCell>
            <TableCell>Cheque Number</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Recipient Name</TableCell>
            <TableCell>Occasion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              style={{
                color: isDateInPast(booking.date) ? red[400] : "inherit",
              }}
            >
              <TableCell>{booking.user?.first_name}</TableCell>
              <TableCell>{booking.user?.last_name}</TableCell>
              <TableCell>
                {!booking.relationship
                  ? "Self"
                  : booking.relationship?.relation +
                    ": " +
                    booking.relationship?.details.first_name +
                    " " +
                    booking.relationship?.details.last_name}
              </TableCell>
              <TableCell>
                {!booking.relationship
                  ? new Date(booking.user?.DOB).toLocaleDateString()
                  : new Date(
                      booking.relationship?.details?.DOB
                    ).toLocaleDateString()}
              </TableCell>
              <TableCell>{booking.user?.email}</TableCell>
              <TableCell>{booking.user?.phone_number}</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {!booking.relationship
                  ? booking.user?.nakshatra
                  : booking.relationship.details.nakshatra}
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {!booking.relationship
                  ? booking.user?.rashi
                  : booking.relationship.details.rashi}
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {!booking.relationship
                  ? booking.user?.gothra
                  : booking.relationship.details.gothra}
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {new Date(booking.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{booking.booking_status}</TableCell>
              <TableCell>
                {booking.rate.annualExpenses +
                  booking.rate.maintenance +
                  booking.rate.priestsHonorarium +
                  booking.rate.endowment +
                  booking.rate.miscellaneous + 
                  booking.rate.priests_contingency}
              </TableCell>
              <TableCell>{booking.transaction.id}</TableCell>
              <TableCell>{booking.transaction.mode}</TableCell>
              <TableCell>
                {booking.transaction.details.receipt_url ? <Button
                  onClick={() =>
                    handleDownloadPDF(
                      booking.transaction.details.receipt_url,
                      `Receipt:${ booking.user.first_name}${booking.user.last_name}`
                    )
                  }
                >
                  View Receipt
                </Button> : null}
              </TableCell>              <TableCell>
                {booking.transaction.details.receipt_number}
              </TableCell>
              <TableCell>{booking.transaction.details.cheque_number}</TableCell>
              <TableCell>{booking.transaction.details.bank_name}</TableCell>
              <TableCell>
                {new Date(
                  booking.transaction.details.payment_date
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>{booking.recipient_name}</TableCell>
              <TableCell>{booking.occasion}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid rgba(224, 224, 224, 1)",
          borderBottomLeftRadius: "4px",
          borderBottomRightRadius: "4px",
          padding: "16px",
          justifyContent: "space-between",
          height: "64px", // Adjust height as needed
          alignItems: "center",
        }}
      />
    </TableContainer>
  );
};

export default MyBookingsTable;
