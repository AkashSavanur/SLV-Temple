import React, { useState, useEffect } from "react";
import { MuiTelInput } from "mui-tel-input";
import emailjs from "@emailjs/browser";
import {
  TableContainer,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import RegisteredUsersTable from "./RegisteredUsersTable";
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentUserState } from "./Atoms";
import { currentUserAtom } from "../App";
import NakshatraRashi from "../JSON/NakshatraRashi.json";
import jsPDF from "jspdf";
import image from "./image";
import Swal from "sweetalert2";
import useBreakpoints from "../Context/useBreakPoints";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import Modal from "@mui/material/Modal";

const RegisteredUsers = () => {
  const { isSm } = useBreakpoints();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("first_name");
  const [purposes, setPurposes] = useState(null);
  const [prices, setPrices] = useState([]);
  const [relationship, setRelationship] = useState(null);
  const [rate, setRate] = useState([]);
  const [receiptNumber, setReceiptNumber] = useState();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [notifyMe, setNotifyMe] = useState("");
  const [csvLoading, setCsvLoading] = useState(false)

  const handleOpen = () => {
    console.log(notifyMe)
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSend = () => {
    console.log('many')
    handleClose();
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/notifications/bulk",
      headers: { Authorization: currentUser.auth_token },
      data: {
        message: message
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const handleSendMe = () => {
    console.log('single')
    handleClose();
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/notifications/single",
      headers: { Authorization: currentUser.auth_token },
      data: {
        message: message,
        phone_number: notifyMe.phone_number
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  //get donation purposes
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

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/user/get",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        page_number: page + 1,
        page_size: rowsPerPage,
        sort: {
          column_name: "created_at",
          isAscending: false,
        },
        search: {
          search_term: searchTerm,
          column_name: searchColumn,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setUsers(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalRows(response.data.total_rows);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [page, rowsPerPage, searchTerm, searchColumn]);

  useEffect(() => {
    const fetchItems = async () => {
      const options = {
        method: "POST",
        url: "https://api.kiruthirupathi.org/rates/get",
        headers: { Authorization: currentUser?.auth_token },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log("rates response", response);
          setPrices(response.data.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    };
    fetchItems();
  }, []);

  // Pagination logic
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, totalRows - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    console.log("page changed", newPage); //works
    setPage(newPage);
    setUsers(null)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (currentUser?.auth_token) {
      const options = {
        method: "GET",
        url: "https://api.kiruthirupathi.org/user/me",
        headers: { Authorization: currentUser.auth_token },
      };

      axios
        .request(options)
        .then(function (response) {
          const updatedUser = {
            ...currentUser,
            data: response.data,
          };
          setCurrentUser(updatedUser);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [currentUser, setCurrentUser]);

  const navigate = useNavigate();
  const handleClick1 = () => {
    navigate("/dashboard");
  };

  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    DOB: "",
    email: "",
    phone_number: "",
    nakshatra: "",
    rashi: "",
    gothra: "",
    roles: {
      isDonor: "",
      isAdoptor: "",
      isAdmin: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
    },
    created_at: "",
    deleted_at: "",
    updated_at: "",
  });

  const [editId, setEditId] = useState(null);
  const [addUser, setAddUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [donationFormData, setDonationFormData] = useState({
    user_id: "",
    purpose_id: "",
    transaction_id: "",
    transaction_mode: "",
    receipt_url: "",
    cheque_number: "",
    bank_name: "",
    payment_date: "",
    recipient_name: "",
    comments: "",
    status: "",
  });

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
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
    const fetchRate = async () => {
      try {
        const rateOptions = {
          method: "POST",
          url: "https://api.kiruthirupathi.org/rates/effectivePrice",
          headers: { Authorization: currentUser.auth_token },
          data: { date: bookingFormData.date },
        };

        const response = await axios.request(rateOptions);
        setRate(response.data?.prevRate);
        console.log(response.data?.prevRate); // Ensure you're getting the expected rate
      } catch (error) {
        console.error("Error fetching rate:", error);
      }
    };

    fetchRate();
  }, [currentUser.auth_token, bookingFormData.date]);

  const resetForm = () => {
    setFormData({
      id: "",
      first_name: "",
      last_name: "",
      DOB: "",
      email: "",
      phone_number: "",
      nakshatra: "",
      rashi: "",
      gothra: "",
      roles: {
        isDonor: "",
        isAdoptor: "",
        isAdmin: "",
      },
      address: {
        city: "",
        state: "",
        pin: "",
        address_line1: "",
        address_line2: "",
      },
      created_at: "",
      deleted_at: "",
      updated_at: "",
    });
  };

  const handleCreate = async () => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/user/create",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        first_name: `${formData?.first_name}`,
        last_name: `${formData?.last_name}`,
        DOB: `${formData?.DOB}`,
        email: `${formData?.email}`,
        phone_number: `${formData?.phone_number}`,
        nakshatra: `${formData?.nakshatra}`,
        rashi: `${formData?.rashi}`,
        gothra: `${formData?.rashi}`,
        roles: {
          isDonor: `${formData?.roles?.isDonor}`,
          isAdoptor: `${formData?.roles?.isAdoptor}`,
          isAdmin: `${formData?.roles?.isAdmin}`,
        },
        address: {
          street: `${formData?.address?.street}`,
          city: `${formData?.address?.city}`,
          state: `${formData?.address?.state}`,
          zip_code: `${formData?.address?.zip_code}`,
        },
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

  const handleUpdate = async (id) => {
    const bdate = new Date(formData?.DOB).toISOString();

    const options = {
      method: "PUT",
      url: `https://api.kiruthirupathi.org/user/update/${id}`,
      headers: { Authorization: currentUser?.auth_token },
      data: {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        DOB: bdate,
        email: formData?.email,
        phone_number: formData?.phone_number,
        nakshatra: formData?.nakshatra,
        rashi: formData?.rashi,
        gothra: formData?.gothra,
        roles: {
          isDonor: formData?.roles?.isDonor,
          isAdoptor: formData?.roles?.isAdoptor,
          isAdmin: formData?.roles?.isAdmin,
        },
        address: {
          street: formData?.address?.street,
          city: formData?.address?.city,
          state: formData?.address?.state,
          zip_code: formData?.address?.zip_code,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        window.location.reload()
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleDelete = async (id) => {
    const userToDelete = users.find((user) => user.id === id);
    const confirmation = prompt(
      `To confirm deletion, type "delete ${userToDelete.first_name} ${userToDelete.last_name}"`
    );

    if (
      confirmation ===
      `delete ${userToDelete.first_name} ${userToDelete.last_name}`
    ) {
      const currentDate = new Date().toISOString();
      const updatedUser = {
        ...userToDelete,
        deleted_at: currentDate,
      };

      try {
        const options = {
          method: "DELETE",
          url: `https://api.kiruthirupathi.org/user/delete/${id}`,
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
      alert(
        "Deletion cancelled. Please type 'delete' followed by the user's first name and last name to confirm deletion."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone_number: value,
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (user) => {
    scrollToTop();
    resetForm();
    setFormData({
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      DOB: user?.DOB,
      email: user?.email || "",
      phone_number: user?.phone_number,
      nakshatra: user?.nakshatra || "",
      rashi: user?.rashi || "",
      gothra: user?.gothra || "",
      roles: {
        isDonor: user?.roles?.isDonor || "",
        isAdoptor: user?.roles?.isAdoptor || "",
        isAdmin: user?.roles?.isAdmin || "",
      },
      address: {
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        pin: user?.address?.pin || "",
        address_line1: user?.address?.address_line1 || "",
        address_line2: user?.address?.address_line2 || "",
      },
      created_at: user?.created_at || "",
      deleted_at: user?.deleted_at || "",
      updated_at: user?.updated_at || "",
    });
    setEditId(user?.id);
  };

  const handleSubmit = () => {
    if (editId) {
      handleUpdate(editId);
    } else {
      handleCreate();
    }
  };

  const downloadCSV = () => {
    setCsvLoading(true)
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/user/csv",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        sort: {
          column_name: orderBy,
          isAscending: order == "asc" ? true : false,
        },
        search: {
          search_term: searchTerm,
          column_name: searchColumn,
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
          link.setAttribute("download", "users.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setCsvLoading(false)

      })
      .catch(function (error) {
        setCsvLoading(false)
        console.error(error);
      });
  };

  const handleToggleAdminStatus = (user) => {
    setUserToToggle(user);
    setDialogOpen(true);
  };

  const confirmToggleAdminStatus = () => {
    const { id } = userToToggle;
    const options = {
      method: "PUT",
      url: `https://api.kiruthirupathi.org/user/update/${id}`,
      headers: { Authorization: currentUser?.auth_token },
      data: {
        ...userToToggle,
        roles: {
          ...userToToggle.roles,
          isAdmin: !userToToggle.roles.isAdmin,
        },
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id
              ? {
                ...user,
                roles: { ...user.roles, isAdmin: !user.roles.isAdmin },
              }
              : user
          )
        );
      })
      .catch(function (error) {
        console.error(error);
      });
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserToToggle(null);
  };

  const handleDonationDialogOpen = (user) => {
    setDonationFormData({
      user_id: user.id,
      purpose_id: "",
      transaction_id: "",
      transaction_mode: "",
      receipt_url: "",
      cheque_number: "",
      bank_name: "",
      payment_date: "",
      recipient_name: "",
      comments: "",
      status: "pending",
    });
    setDonationDialogOpen(true);
  };

  const handleDonationDialogClose = () => {
    setDonationDialogOpen(false);
    setDonationFormData({
      user_id: "",
      purpose_id: "",
      transaction_id: "",
      transaction_mode: "",
      receipt_url: "",
      cheque_number: "",
      bank_name: "",
      payment_date: "",
      recipient_name: "",
      comments: "",
      status: "",
    });
  };

  const handleDonationFormChange = (e) => {
    const { name, value } = e.target;
    setDonationFormData({ ...donationFormData, [name]: value });
  };

  const handleDonationSubmitParent = async () => {
    const utils = {
      method: "GET",
      url: "https://api.kiruthirupathi.org/utils/next",
      headers: { Authorization: currentUser?.auth_token },
    };

    axios
      .request(utils)
      .then(function (response) {
        setReceiptNumber(response.data);
        handleDonationSubmit(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleDonationSubmit = async (receipt_number) => {
    const userToSubmit = users.find(
      (user) => user.id === donationFormData.user_id
    );
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
    const imageURL = image();

    const margin = 20; // Define the side margin

    // Add the image

    doc.addImage(imageURL, "PNG", pageWidth / 2 - 25, 10, 50, 50);

    // Define the text and calculate the width for centering
    const templeName = "SRI LAKSHMI VENKATARAMANA TEMPLE";
    const templeAddress =
      "Durga, Karkala Taluk, Udupi District, Karnataka - 576117";
    const phoneText = "Phone: +91 72042 13913";
    const emailText = "Email: slv.durga.temple@gmail.com";

    // Center the first two lines
    doc.text(templeName, pageWidth / 2, 70, { align: "center" }); // Adjust vertical position
    doc.text(templeAddress, pageWidth / 2, 80, { align: "center" }); // Adjust vertical position

    // Set font size to smaller value
    doc.setFontSize(10);

    // Add other details with margins
    doc.text(phoneText, margin, 100); // Adjust vertical position
    doc.text(emailText, margin, 110); // Adjust vertical position

    // Receipt Details

    doc.text(`Date: ${donationFormData.payment_date}`, margin, 140); // Adjust vertical position
    doc.text(`Receipt Number: ${receipt_number}`, margin, 150); // Adjust vertical position

    // Donor Details
    doc.text(
      `Received with thanks from: ${userToSubmit.first_name} ${userToSubmit.last_name}`,
      margin,
      160
    ); // Adjust vertical position
    const selectedPurpose = purposes.find(
      (purpose) => purpose.id === donationFormData.purpose_id
    );
    const purposeName = selectedPurpose ? selectedPurpose.name : "";

    // Now use purposeName in your PDF generation logic
    doc.text(`For the purpose of ${purposeName}`, margin, 170); // Adjust vertical position

    // Amount Details
    doc.text(`A sum of Rupees: ${donationFormData.amount}`, margin, 190); // Adjust vertical position
    doc.text(`Rs ${donationFormData.amount}`, margin, 200); // Adjust vertical position

    // Closing
    doc.text(`Thanks & Regards`, margin, 220); // Adjust vertical position
    doc.text(`Managing Trustee`, margin, 240); // Adjust vertical position

    const pdfData = doc.output("dataurlstring");

    const serviceID = "service_47d9vgi";
    const templateID = "template_8th4gfh";
    const userID = "T-Mrf-HKduN8T0vwj";
    const htmlContent = `
  <p style="text-align: center;">${templeName}</p>
  <p style="text-align: center;">${templeAddress}</p>
  <p>${phoneText}</p>
  <p>${emailText}</p>
  <p>Receipt No: ${receipt_number}</p>
  <p>Date: ${donationFormData.payment_date}</p>
  <p>Received with thanks from: ${userToSubmit.first_name} ${userToSubmit.last_name}</p>
  <p>For the purpose of: ${purposeName}</p>
  <p>A sum of Rupees: Rs.${donationFormData.amount}</p>
  <p>Thanks & Regards</p>
  <p>Managing Trustee</p>
`;

    // Prepare the email parameters
    const templateParams = {
      to_name: userToSubmit.first_name,
      to_email: userToSubmit.email, // Email recipient
      from_name: "SLV-Temple-Durga", // Sender's name
      message_html: htmlContent,
    };
    console.log(currentUser.data.email);
    // Send email using emailjs
    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((result) => {
        console.log(result.text); // Log success message
      })
      .catch((error) => {
        console.error("Error sending email:", error); // Log error message
      });
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/donation/create",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        user_id: donationFormData?.user_id,
        comments: donationFormData?.comments,
        amount: parseInt(donationFormData?.amount),
        purpose_id: donationFormData?.purpose_id,
        transaction: {
          id: donationFormData?.transaction_id,
          mode: donationFormData?.transaction_mode,
          details: {
            receipt_url: pdfData,
            cheque_number: donationFormData?.cheque_number,
            receipt_number: receipt_number,
            bank_name: donationFormData?.bank_name,
            payment_date: donationFormData?.payment_date,
          },
        },
        recipient_name: donationFormData?.recipient_name,
        status: donationFormData?.status,
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

    setDonationDialogOpen(false);
  };

  const handleBookingDialogOpen = (user) => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/relationship/get",
      headers: { Authorization: currentUser.auth_token },
      data: {
        user_id: user.id,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        setRelationship(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    setBookingFormData({
      user_id: user.id,
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
    setBookingDialogOpen(true);
  };

  const handleBookingDialogClose = () => {
    setBookingDialogOpen(false);
    setBookingFormData({
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
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({ ...bookingFormData, [name]: value });
  };

  const handleBookingSubmitParent = async () => {
    const utils = {
      method: "GET",
      url: "https://api.kiruthirupathi.org/utils/next",
      headers: { Authorization: currentUser?.auth_token },
    };

    axios
      .request(utils)
      .then(function (response) {
        setReceiptNumber(response.data);
        handleBookingSubmit(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleBookingSubmit = async (receipt_number) => {
    const updatedRelationshipId =
      bookingFormData.relationship_id === "self"
        ? null
        : bookingFormData.relationship_id;

    const userToSubmit = users.find(
      (user) => user.id === bookingFormData.user_id
    );

    console.log("rate", rate);
    const effectivePrice =
      rate?.annualExpenses +
      rate?.endowment +
      rate?.maintenance +
      rate?.miscellaneous +
      rate?.priestsHonorarium +
      rate?.priests_contingency;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
    const margin = 20; // Define the side margin
    const imageURL = image();

    // Add the image
    doc.addImage(imageURL, "PNG", pageWidth / 2 - 25, 10, 50, 50);
    // Define the text and calculate the width for centering
    const templeName = "SRI LAKSHMI VENKATARAMANA TEMPLE";
    const templeAddress =
      "Durga, Karkala Taluk, Udupi District, Karnataka - 576117";
    const phoneText = "Phone: +91 72042 13913";
    const emailText = "Email: slv.durga.temple@gmail.com";

    // Center the first two lines
    doc.text(templeName, pageWidth / 2, 70, { align: "center" }); // Adjust vertical position
    doc.text(templeAddress, pageWidth / 2, 80, { align: "center" }); // Adjust vertical position

    // Set font size to smaller value
    doc.setFontSize(10);

    // Add other details with margins
    doc.text(phoneText, margin, 100); // Adjust vertical position
    doc.text(emailText, margin, 110); // Adjust vertical position

    doc.text(`Date: ${new Date()}`, margin, 140); // Adjust vertical position
    doc.text(`Receipt Number: ${receipt_number}`, margin, 150);

    // Donor Details
    doc.text(
      `Received with thanks from: ${userToSubmit.first_name} ${userToSubmit.last_name} `,
      margin,
      160
    ); // Adjust vertical position
    doc.text(`For the occasion of ${bookingFormData.occasion} `, margin, 170); // Adjust vertical position

    // Amount Details
    doc.text(`A sum of Rupees: ${effectivePrice} `, margin, 190); // Adjust vertical position
    doc.text(`Rs ${effectivePrice} `, margin, 200); // Adjust vertical position

    // Closing
    doc.text(`Thanks & Regards`, margin, 220); // Adjust vertical position
    doc.text(`Managing Trustee`, margin, 240); // Adjust vertical position

    const pdfData = doc.output("dataurlstring");

    const serviceID = "service_47d9vgi";
    const templateID = "template_8th4gfh";
    const userID = "T-Mrf-HKduN8T0vwj";
    const htmlContent = `
                          <p style="text-align: center;">${templeName}</p>
                          <p style="text-align: center;">${templeAddress}</p>
                          <p>${phoneText}</p>
                          <p>${emailText}</p>
                          <p>Receipt No: ${receipt_number}</p>
                          <p>Date: ${bookingFormData.transaction_details_payment_date}</p>
                          <p>Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}</p>
                          <p>For the occasion of ${bookingFormData.occasion}</p>
                          <p>A sum of Rupees: Rs.${effectivePrice}</p>
                          <p>Thanks & Regards</p>
                          <p>Managing Trustee</p>
`;

    // Prepare the email parameters
    const templateParams = {
      to_name: userToSubmit.first_name,
      to_email: userToSubmit.email, // Email recipient
      from_name: "SLV-Temple-Durga", // Sender's name
      message_html: htmlContent,
    };
    // Send email using emailjs
    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((result) => {
        console.log(result.text); // Log success message
      })
      .catch((error) => {
        console.error("Error sending email:", error); // Log error message
      });

    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/create",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        user_id: bookingFormData.user_id,
        date: bookingFormData.date,
        booking_status: bookingFormData.booking_status,
        relationship_id: updatedRelationshipId,
        transaction: {
          id: bookingFormData.transaction_id,
          mode: bookingFormData.transaction_mode,
          details: {
            receipt_url: pdfData,
            cheque_number: bookingFormData.transaction_details_cheque_number,
            receipt_number: receipt_number,
            bank_name: bookingFormData.transaction_details_bank_name,
            payment_date: bookingFormData.transaction_details_payment_date,
          },
        },
        recipient_name: bookingFormData.recipient_name,
        occasion: bookingFormData.occasion,
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

    setBookingDialogOpen(false);
  };

  const handleRelationships = (user) => {
    navigate(`/relationships/${user.id}`);
  };
  return (
    <div style={{ overflowX: "hidden" }} className="registered-users">
      <center>
        <header
          style={{
            background:
              "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
            color: "black",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {isSm ? <h1>Manage Registered Users</h1> : <h2>Manage Registered Users</h2>}

          <HomeIcon className="home" fontSize="large" onClick={handleClick1} />
        </header>
      </center>
      {(editId || addUser) && (
        <form
          className="form"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <TextField
            type="text"
            name="first_name"
            label="First Name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="text"
            name="last_name"
            label="Last Name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="date"
            name="DOB"
            label="Date of Birth"
            placeholder="Date of Birth"
            value={formData.DOB}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            required // Add required attribute
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <MuiTelInput
            placeholder="Phone Number"
            value={formData.phone_number} // Assuming phoneNumber is your state variable for phone number
            onChange={handlePhoneChange} // Assuming handlePhoneNumberChange is your change handler function
            fullWidth
          />

          <FormControl fullWidth margin="normal" size="small" required>
            <InputLabel id="nakshatra-label">Nakshatra</InputLabel>
            <Select
              labelId="nakshatra-label"
              name="nakshatra"
              value={formData.nakshatra || ""}
              onChange={handleChange}
              label="Nakshatra"
            >
              {NakshatraRashi?.nakshatraNames?.map((nakshatra, index) => (
                <MenuItem key={index} value={nakshatra}>
                  {nakshatra}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" size="small" required>
            <InputLabel id="rashi-label">Rashi</InputLabel>
            <Select
              labelId="rashi-label"
              name="rashi"
              value={formData.rashi || ""}
              onChange={handleChange}
              label="Rashi"
            >
              {NakshatraRashi?.rashiNames?.map((rashi, index) => (
                <MenuItem key={index} value={rashi}>
                  {rashi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            name="gothra"
            label="Gothra"
            placeholder="Gothra"
            value={formData.gothra}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="text"
            name="address.street"
            label="Street"
            placeholder="Street"
            value={formData.address.street}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="text"
            name="address.city"
            label="City"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="text"
            name="address.state"
            label="State"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <TextField
            type="text"
            name="address.zip_code"
            label="Pin"
            placeholder="Pin"
            value={formData.address.zip_code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required // Add required attribute
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginLeft: "10px", marginTop: "20px" }}
          >
            {editId ? "Update" : "Create"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={resetForm}
            style={{ marginLeft: "10px", marginTop: "20px" }}
          >
            Reset
          </Button>
        </form>
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
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Column</InputLabel>
                <Select
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                  label="Column"
                >
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone_number">Phone Number</MenuItem>
                  {/* Add more columns as needed */}
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
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  marginRight: "10px",
                }}
                disabled={csvLoading}
              >
                {csvLoading ? "Downloading..." : "Download CSV"}
              </Button>
              <Button
                variant="contained"
                onClick={() => setAddUser(true)}
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  backgroundColor: "purple",
                  marginRight: "10px",
                }}
                startIcon={<AddIcon />}
              >
                Add User
              </Button>
              <Button
                variant="contained"
                onClick={handleOpen}
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  backgroundColor: "red"
                }}
                startIcon={<NotificationsIcon />}
              >
                Notify Users
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
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: "10px" }} // Added margin for spacing
              />
              <FormControl
                variant="outlined"
                fullWidth
                sx={{ marginBottom: "10px" }}
              >
                <InputLabel>Column</InputLabel>
                <Select
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                  label="Column"
                >
                  <MenuItem value="first_name">First Name</MenuItem>
                  <MenuItem value="last_name">Last Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone_number">Phone Number</MenuItem>
                  {/* Add more columns as needed */}
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
                sx={{ marginBottom: "10px", width: "100%" }} // Added margin for spacing and full width
                disabled={csvLoading}
              >
                {csvLoading ? "Downloading..." : "Download CSV"}
              </Button>
              <Button
                variant="contained"
                onClick={() => setAddUser(true)}
                sx={{ backgroundColor: "purple", width: "100%" }} // Full width
                startIcon={<AddIcon />}
              >
                Add User
              </Button>
              <Button
                variant="contained"
                onClick={handleOpen}
                sx={{ backgroundColor: "red", width: "100%", marginTop: '10px' }} // Full width
                startIcon={<NotificationsIcon />}
              >
                Notify Users
              </Button>
            </div>
          </div>
        )}

        <RegisteredUsersTable
          users={users}
          setUsers={setUsers}
          onDelete={handleDelete}
          onEdit={handleEdit}
          toggleAdminStatus={handleToggleAdminStatus}
          handleDonationDialogOpen={handleDonationDialogOpen} // Pass updated handler here
          handleBookingDialogOpen={handleBookingDialogOpen}
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
          handleRelationships={handleRelationships}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          open={open}
          setOpen={setOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          message={message}
          setMessage={setMessage}
          handleMessage={handleMessage}
          notifyMe={notifyMe}
          setNotifyMe={setNotifyMe}
        />
      </div>

      {/* Confirmation dialog for toggling admin status */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Admin Status Change</DialogTitle>
        <DialogContent>
          <Typography>
            To confirm toggling admin status for{" "}
            {userToToggle &&
              `${userToToggle.first_name} ${userToToggle.last_name}`}
            , type their first name and last name below:
          </Typography>
          <input
            type="text"
            placeholder={`Type ${userToToggle ? userToToggle.first_name : ""} ${userToToggle ? userToToggle.last_name : ""
              }`}
            onChange={(e) => {
              const { value } = e.target;
              if (
                value.toLowerCase() ===
                `${userToToggle.first_name.toLowerCase()} ${userToToggle.last_name.toLowerCase()}`
              ) {
                confirmToggleAdminStatus();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={donationDialogOpen} onClose={handleDonationDialogClose}>
        <DialogTitle>Add Donation</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              fullWidth
              type="text"
              name="amount"
              label="Amount"
              value={donationFormData.amount}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="comments"
              label="Add a Comment"
              value={donationFormData.comments}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="transaction_id"
              label="Transaction ID"
              value={donationFormData.transaction_id}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="transaction_mode"
              label="Transaction Mode"
              value={donationFormData.transaction_mode}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              name="cheque_number"
              label="Cheque Number"
              value={donationFormData.cheque_number}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="bank_name"
              label="Bank Name"
              value={donationFormData.bank_name}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              name="payment_date"
              label="Payment Date"
              value={donationFormData.payment_date}
              onChange={handleDonationFormChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="text"
              name="recipient_name"
              label="Recipient Name"
              value={donationFormData.recipient_name}
              onChange={handleDonationFormChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={donationFormData.status}
                onChange={handleDonationFormChange}
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
                value={donationFormData.purpose_id}
                onChange={handleDonationFormChange}
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
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDonationDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDonationSubmitParent} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={bookingDialogOpen} onClose={handleBookingDialogClose}>
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
          <form>
            <FormControl fullWidth margin="normal">
              <InputLabel id="booking-status-label">Booking Status</InputLabel>
              <Select
                labelId="booking-status-label"
                name="booking_status"
                value={bookingFormData.booking_status}
                onChange={handleBookingFormChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              select
              fullWidth
              label="On behalf of"
              name="relationship_id"
              value={bookingFormData.relationship_id}
              onChange={handleBookingFormChange}
              variant="outlined"
              margin="normal"
            >
              {relationship &&
                relationship.map((relation) => (
                  <MenuItem key={relation.id} value={relation.id}>
                    {relation.relation +
                      ": " +
                      relation.details.first_name +
                      " " +
                      relation.details.last_name}
                  </MenuItem>
                ))}
              <MenuItem key="self" value="self">
                Self
              </MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="date"
              name="date"
              label="Date"
              value={bookingFormData.date}
              onChange={handleBookingFormChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            {/* {<TextField
              fullWidth
              disabled
              type="number"
              name="amount"
              label="Amount"
              placeholder="Amount"
              value={prices?[prices.length-1].priestsHonorarium + prices?[prices.length-1].annualExpenses + prices?[prices.length-1].maintenance + prices?[prices.length-1].endowment + prices?[prices.length-1].miscellaneous}
              onChange={handleBookingFormChange}
              margin="normal"
            />} */}
            <TextField
              fullWidth
              type="text"
              name="transaction_id"
              label="Transaction ID"
              placeholder="Transaction ID"
              value={bookingFormData.transaction_id}
              onChange={handleBookingFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="transaction_mode"
              label="Transaction Mode"
              placeholder="Transaction Mode"
              value={bookingFormData.transaction_mode}
              onChange={handleBookingFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              name="transaction_details_cheque_number"
              label="Cheque Number"
              placeholder="Cheque Number"
              value={bookingFormData.transaction_details_cheque_number}
              onChange={handleBookingFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="transaction_details_bank_name"
              label="Bank Name"
              placeholder="Bank Name"
              value={bookingFormData.transaction_details_bank_name}
              onChange={handleBookingFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              name="transaction_details_payment_date"
              label="Payment Date"
              placeholder="Payment Date"
              value={bookingFormData.transaction_details_payment_date}
              onChange={handleBookingFormChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="text"
              name="recipient_name"
              label="Recipient Name"
              placeholder="Recipient Name"
              value={bookingFormData.recipient_name}
              onChange={handleBookingFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="text"
              name="occasion"
              label="Occasion"
              placeholder="Occasion"
              value={bookingFormData.occasion}
              onChange={handleBookingFormChange}
              margin="normal"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleBookingDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBookingSubmitParent} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#ffffff", // Background color
          borderRadius: 8, // Rounded corners
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)", // Box shadow for depth
          p: 4, // Padding inside the modal
          outline: "none", // Remove outline when focused
          overflow: "auto", // Enable scrolling if content overflows
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter Message
          </Typography>
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={message}
            onChange={handleMessage}
            variant="outlined"
            margin="normal"
            style={{ flexGrow: 1 }}
          />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={notifyMe ? handleSendMe : handleSend}
              startIcon={<SendIcon />}
              sx={{ margin: "8px" }}
            >
              Send
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ margin: "8px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <style jsx>
        {`
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
      
      `}
      </style>
    </div>
  );
};

export default RegisteredUsers;
