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
  Divider,
  IconButton,
  Paper,
  TablePagination,
  TableSortLabel,
  Stack,
  LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, grey } from "@mui/material/colors";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from '@mui/icons-material/Notifications';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const pastelColors = {
  admin: { background: '#E3F2FD', text: '#0D47A1' },
  relationships: { background: '#F3E5F5', text: '#4A148C' },
  donation: { background: '#E8F5E9', text: '#1B5E20' },
  adoptADay: { background: '#FFF3E0', text: '#E65100' },
  notify: { background: '#FFFDE7', text: '#F57F17' },
};

const RegisteredUsersTable = ({
  users,
  setUsers,
  onDelete,
  onEdit,
  toggleAdminStatus,
  handleDonationDialogOpen,
  handleBookingDialogOpen,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  totalRows,
  currentPage,
  handleRelationships,
  currentUser,
  setCurrentPage,
  setTotalRows,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  open,
  setOpen,
  handleOpen,
  handleClose,
  message,
  setMessage,
  handleMessage,
  notifyMe,
  setNotifyMe
}) => {
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, order, orderBy]);

  const fetchUsers = async () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/user/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name: orderBy,
          isAscending: order == "asc" ? true : false,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setUsers(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalRows(response.data.total_rows);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (user) => {
    handleOpen();
    setNotifyMe(user);
  };

  return (
    users && users.length > 0 ?
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "lightblue",
              }}
            >
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
              <TableCell>DOB</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Nakshatra</TableCell>
              <TableCell>Rashi</TableCell>
              <TableCell>Gothra</TableCell>
              <TableCell>Is Donor</TableCell>
              <TableCell>Is Adoptor</TableCell>
              <TableCell>Is Admin</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Pin</TableCell>
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
              <TableCell style={{
                textAlign: 'center'
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell
                  style={{ color: user.deleted_at ? red[500] : "inherit" }}
                >
                  {user?.first_name}
                </TableCell>
                <TableCell
                  style={{ color: user.deleted_at ? red[500] : "inherit" }}
                >
                  {user?.last_name}
                </TableCell>
                <TableCell>{user.DOB ? new Date(user.DOB).toLocaleDateString() : null}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>{user.nakshatra}</TableCell>
                <TableCell>{user.rashi}</TableCell>
                <TableCell>{user.gothra}</TableCell>
                <TableCell>{user.roles?.isDonor ? "✅" : ""}</TableCell>
                <TableCell>{user.roles?.isAdoptor ? "✅" : ""}</TableCell>
                <TableCell>{user.roles?.isAdmin ? "✅" : ""}</TableCell>
                <TableCell>{user.address?.street}</TableCell>
                <TableCell>{user.address?.city}</TableCell>
                <TableCell>{user.address?.state}</TableCell>
                <TableCell>{user.address?.zip_code}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.deleted_at
                    ? new Date(user.deleted_at).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  {!user.deleted_at ? (
                    <Stack direction="column" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => onEdit(user)}
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.admin.background,
                          color: pastelColors.admin.text,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => onDelete(user.id)}
                        startIcon={<DeleteIcon />}
                        size="small"
                        sx={{
                          backgroundColor: red[100],
                          color: red[700],
                        }}
                      >
                        Delete
                      </Button>
                      <Divider />
                      <Button
                        variant="contained"
                        onClick={() => toggleAdminStatus(user)}
                        startIcon={<SupervisorAccountIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.admin.background,
                          color: pastelColors.admin.text,
                        }}
                      >
                        {user.roles?.isAdmin ? "Revoke Admin" : "Promote to Admin"}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleRelationships(user)}
                        startIcon={<FamilyRestroomIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.relationships.background,
                          color: pastelColors.relationships.text,
                        }}
                      >
                        View Relationships
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDonationDialogOpen(user)}
                        startIcon={<AddIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.donation.background,
                          color: pastelColors.donation.text,
                        }}
                      >
                        Add Donation
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleBookingDialogOpen(user)}
                        startIcon={<AddIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.adoptADay.background,
                          color: pastelColors.adoptADay.text,
                        }}
                      >
                        Add Adopt A Day
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleClick(user)}
                        startIcon={<NotificationsIcon />}
                        size="small"
                        sx={{
                          backgroundColor: pastelColors.notify.background,
                          color: pastelColors.notify.text,
                        }}
                      >
                        Notify User
                      </Button>
                    </Stack>
                  ) : (
                    <Button variant="contained" disabled>
                      <EditIcon sx={{ color: grey[700] }} />
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={22} />
              </TableRow>
            )}
          </TableBody>
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
            width: "100%",
            borderTop: "1px solid rgba(224, 224, 224, 1)",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            padding: "16px",
            justifyContent: "space-between",
            height: "64px",
            alignItems: "center",
          }}
        />
      </TableContainer> :
      <div>
        <LinearProgress />
      </div>
  );
};

export default RegisteredUsersTable;
