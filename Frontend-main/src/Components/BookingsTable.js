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
  LinearProgress,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, grey } from "@mui/material/colors";
import { useEffect } from "react";

const BookingsTable = ({
  totalAmount,
  bookings,
  setBookings,
  onDelete,
  onEdit,
  page,
  setPage,
  rowsPerPage,
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
  currentPage,
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

  const handleDownloadPDF = async (pdfUrl, fileName) => {
    try {
      const response = await axios.get(pdfUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "document.pdf");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    bookings && bookings.length > 0 ? (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
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
              <TableCell sortDirection={orderBy === "date" ? order : false}>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleRequestSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
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
              <TableCell>Rate ID</TableCell>
              <TableCell>Occasion</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell sortDirection={orderBy === "created_at" ? order : false}>
                <TableSortLabel
                  active={orderBy === "created_at"}
                  direction={orderBy === "created_at" ? order : "asc"}
                  onClick={() => handleRequestSort("created_at")}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "updated_at" ? order : false}>
                <TableSortLabel
                  active={orderBy === "updated_at"}
                  direction={orderBy === "updated_at" ? order : "asc"}
                  onClick={() => handleRequestSort("updated_at")}
                >
                  Updated At
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "deleted_at" ? order : false}>
                <TableSortLabel
                  active={orderBy === "deleted_at"}
                  direction={orderBy === "deleted_at" ? order : "asc"}
                  onClick={() => handleRequestSort("deleted_at")}
                >
                  Deleted At
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell style={{ color: booking.deleted_at ? red[500] : "inherit" }}>
                  {booking.user?.first_name}
                </TableCell>
                <TableCell style={{ color: booking.deleted_at ? red[500] : "inherit" }}>
                  {booking.user?.last_name}
                </TableCell>
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
                    : new Date(booking.relationship?.details?.DOB).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.user?.email}</TableCell>
                <TableCell>{booking.user?.phone_number}</TableCell>
                <TableCell>
                  {!booking.relationship
                    ? booking.user?.nakshatra
                    : booking.relationship.details.nakshatra}
                </TableCell>
                <TableCell>
                  {!booking.relationship
                    ? booking.user?.rashi
                    : booking.relationship.details.rashi}
                </TableCell>
                <TableCell>
                  {!booking.relationship
                    ? booking.user?.gothra
                    : booking.relationship.details.gothra}
                </TableCell>
                <TableCell style={{ color: booking.deleted_at ? red[500] : "inherit" }}>
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
                  {booking.transaction.details.receipt_url ? (
                    <Button
                      onClick={() =>
                        handleDownloadPDF(
                          booking.transaction.details.receipt_url,
                          `Receipt:${booking.user.first_name}${booking.user.last_name}`
                        )
                      }
                    >
                      View Receipt
                    </Button>
                  ) : null}
                </TableCell>
                <TableCell>{booking.transaction.details.receipt_number}</TableCell>
                <TableCell>{booking.transaction.details.cheque_number}</TableCell>
                <TableCell>{booking.transaction.details.bank_name}</TableCell>
                <TableCell>
                  {new Date(booking.transaction.details.payment_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.recipient_name}</TableCell>
                <TableCell>{booking.rate_id}</TableCell>
                <TableCell>{booking.occasion}</TableCell>
                <TableCell>{booking.comments}</TableCell>
                <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {booking.deleted_at ? new Date(booking.deleted_at).toLocaleDateString() : ""}
                </TableCell>
                <TableCell>
                  {!booking.deleted_at ? (
                    <Button onClick={() => onEdit(booking)}>
                      <EditIcon />
                    </Button>
                  ) : (
                    <Button disabled onClick={() => onEdit(booking)}>
                      <EditIcon />
                    </Button>
                  )}
                  {!booking.deleted_at ? (
                    <Button onClick={() => onDelete(booking.id)}>
                      <DeleteIcon sx={{ color: red[500] }} />
                    </Button>
                  ) : (
                    <Button disabled onClick={() => onDelete(booking.id)}>
                      <DeleteIcon sx={{ color: grey[700] }} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
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
            height: "64px",
            alignItems: "center",
          }}
        />
      </TableContainer>
    ) : (
      <div>
        {bookings && bookings.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            Bookings not found
          </Typography>
        ) : (
          <LinearProgress />
        )}
      </div>
    )
  );
};

export default BookingsTable;
