import React, { useState, useEffect } from "react";
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

const MyDonationsTable = ({
  donations,
  handleDelete,
  setDonations,
  handleEdit,
  setTotalRows,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  emptyRows,
  totalRows,
  currentPage,
  setCurrentPage,
  currentUser,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  fetchDonations,
  collumn,
  search
}) => {
  

  useEffect(() => {
    fetchDonations();
  }, [page, rowsPerPage, order, orderBy, collumn, search]);

  

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
      <Table style={{ display: "table", flexDirection: "column" }}>
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
            <TableCell>DOB</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Transaction Mode</TableCell>
            <TableCell>Receipt URL</TableCell>
            <TableCell>Cheque Number</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Recipient Name</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell sortDirection={orderBy === "amount" ? order : false}>
              <TableSortLabel
                active={orderBy === "amount"}
                direction={orderBy === "amount" ? order : "asc"}
                onClick={() => handleRequestSort("amount")}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            <TableCell>Status</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              {/* Display donation data */}
              <TableCell>{donation.user?.first_name}</TableCell>
              <TableCell>{donation.user?.last_name}</TableCell>
              <TableCell>{new Date(donation.user?.DOB).toLocaleDateString()}</TableCell>
              <TableCell>{donation.user?.phone_number}</TableCell>
              <TableCell>{donation.transaction.id}</TableCell>
              <TableCell>{donation.transaction.mode}</TableCell>
              <TableCell>
                {donation.transaction.details.receipt_url ? (
                  <Button
                    onClick={() =>
                      handleDownloadPDF(
                        donation.transaction.details.receipt_url,
                        `Receipt:${donation.user.first_name}${donation.user.last_name}`
                      )
                    }
                  >
                    View Receipt
                  </Button>
                ) : null}
              </TableCell>
              <TableCell>
                {donation.transaction.details.cheque_number}
              </TableCell>
              <TableCell>{donation.transaction.details.bank_name}</TableCell>
              <TableCell>{new Date(donation.transaction.details.payment_date).toLocaleDateString()}</TableCell>
              <TableCell>{donation.recipient_name}</TableCell>
              <TableCell>{donation.purpose.name}</TableCell>
              <TableCell>{donation.amount}</TableCell>
              <TableCell>{donation.status}</TableCell>
              
            </TableRow>
          ))}
          {/* Empty rows for pagination */}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={18} />
            </TableRow>
          )}
        </TableBody>
        {/* Pagination footer */}
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          width: "400px",
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

export default MyDonationsTable;