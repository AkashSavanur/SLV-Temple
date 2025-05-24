import React, { useState, useEffect } from "react";
import { Button, TextField, Box, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { currentUserAtom } from "../App";
import axios from "axios";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import PaymentIcon from "@mui/icons-material/Payment";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import image from "./image";

const style = {
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
};

const ClientDonation = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [purposes, setPurposes] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openOffline, setOpenOffline] = React.useState(false);
  const handleOpenOffline = () => {
    setOpen(false);
    setOpenOffline(true);
  };
  const handleCloseOffline = () => setOpenOffline(false);

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

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/purposes/get",
      headers: { Authorization: currentUser.auth_token },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("purpose response", response.data);
        setPurposes(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [currentUser.auth_token]);

  const API_URL = "https://https://api.kiruthirupathi.org/donation";
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    purpose: "",
    comments: "",
    amount: "",
    transaction_id: "",
    transaction_mode: "",
    receipt_url: "",
    cheque_number: "",
    bank_name: "",
    payment_date: "",
    recipient_name: "RazorPay",
    status: "completed",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        const listDonations = await response.json();
        setDonations(listDonations);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const handleCheckout = async (e) => {
    handleClose();
    
    if (!currentUser.data.email) {
      const { isConfirmed } = await Swal.fire({
        text: "Please remember to fill in your email address in your profile.",
        showCancelButton: true,
        confirmButtonText: "OK",
      });
    
      if (!isConfirmed) {
        return;
      }
    }
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/checkout/create",
      headers: { Authorization: currentUser.auth_token },
      data: {
        amount: formData?.amount * 100,
      },
    };
  
    axios
      .request(options)
      .then(async function (response) {
        console.log("checkout response", response.data);
        var options = {
          //TODO: dotenv
          key: "rzp_test_LRoMzlrK7O7ZzL",
          amount: formData.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          name: "Sri Lakshmi Venkatramana Temple",
          description: "Donation",
          order_id: response?.data?.order?.id,
          handler: async function (rzpResponse) {
            const body = {
              ...rzpResponse,
              order_id: response?.data?.order?.id, // Add order_id to the body
            };
  
            try {
              const validate = await fetch(
                "https://api.kiruthirupathi.org/checkout/validate",
                {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.auth_token,
                  },
                }
              );
  
              if (!validate.ok) {
                throw new Error("Network response was not ok");
              }
  
              const jsonres = await validate.json();
  
              console.log("validate json", jsonres);
  
              if (validate.status == 201) {
                const miliseconds = jsonres.details.created_at * 1000;
                const paymentDate = new Date(miliseconds);
                console.log("paymentDate", paymentDate);
  
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
                doc.text(
                  `Receipt No: ${response?.data?.order?.receipt}`,
                  margin,
                  130
                ); // Adjust vertical position
                
                doc.text(`Date: ${paymentDate}`, margin, 140); // Adjust vertical position
                doc.text(
                  `Status: Completed`,
                  margin,
                  150
                ); // Adjust vertical position
  
                // Donor Details
                doc.text(
                  `Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}`,
                  margin,
                  160
                ); // Adjust vertical position
                const selectedPurpose = purposes.find(
                  (purpose) => purpose.id === formData.purpose
                );
                const purposeName = selectedPurpose ? selectedPurpose.name : "";
  
                // Now use purposeName in your PDF generation logic
                doc.text(`For the purpose of ${purposeName}`, margin, 170); // Adjust vertical position
  
                // Amount Details
                doc.text(
                  `A sum of Rupees: ${jsonres.details.amount / 100}`,
                  margin,
                  190
                ); // Adjust vertical position
                doc.text(`Rs ${jsonres.details.amount / 100}`, margin, 200); // Adjust vertical position
  
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
                  <p>Receipt No: ${response?.data?.order?.receipt}</p>
                  <p>Status: Completed</p>
                  <p>Date: ${paymentDate}</p>
                  <p>Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}</p>
                  <p>For the purpose of ${purposeName}</p>
                  <p>A sum of Rupees: Rs.${formData.amount}</p>
                  <p>Order ID: ${response?.data?.order?.id}</p>
                  <p>Thanks & Regards</p>
                  <p>Managing Trustee</p>
                `;
  
                // Prepare the email parameters
                const templateParams = {
                  to_name: currentUser.data.first_name,
                  to_email: currentUser.data.email, // Email recipient
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
  
                handleCreate(
                  e,
                  jsonres?.payment_id,
                  jsonres.details.method,
                  pdfData,
                  response.data.order.receipt,
                  null,
                  jsonres.details.bank,
                  paymentDate
                );
              }
            } catch (error) {
              console.error("Error validating payment:", error);
            }
          },
          notes: {
            address: "Doozie Software Solutions",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        var rzp1 = new window.Razorpay(options);
        console.log("razor pay object");
        rzp1.on("payment.failed", function (response) {
          Swal.fire({
            text: "Payment invalid",
          });
        });
        rzp1.open();
        e.preventDefault();
      })
      .catch(function (error) {
        console.error("Error creating checkout:", error);
      });
  };
  

  const handleCreate = async (
    e,
    id,
    mode,
    receipt_url,
    receipt_number,
    cheque_number,
    bank_name,
    payment_date
  ) => {
    e.preventDefault();
  
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
    doc.text(`Date: ${new Date()}`, margin, 140); // Adjust vertical position
    doc.text(
      `Status: Pending`,
      margin,
      150
    ); // Adjust vertical position
  
    // Donor Details
    doc.text(
      `Received with thanks from: ${currentUser?.data?.first_name} ${currentUser?.data?.last_name}`,
      margin,
      160
    ); // Adjust vertical position
    const selectedPurpose = purposes.find(
      (purpose) => purpose.id === formData.purpose
    );
    const purposeName = selectedPurpose ? selectedPurpose.name : "";
  
    // Now use purposeName in your PDF generation logic
    doc.text(`For the purpose of ${purposeName}`, margin, 170); // Adjust vertical position
  
    // Amount Details
    doc.text(`A sum of Rupees: ${formData.amount}`, margin, 190); // Adjust vertical position
    doc.text(`Rs ${formData.amount}`, margin, 200); // Adjust vertical position
  
    // Closing
    doc.text(`Thanks & Regards`, margin, 220); // Adjust vertical position
    doc.text(`Managing Trustee`, margin, 240); // Adjust vertical position
  
    const pdfData = doc.output("dataurlstring");
  
    const status = openOffline ? "pending" : "completed";
  
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/donation/create",
      headers: { Authorization: currentUser?.auth_token },
      data: {
        user_id: currentUser?.data.id,
        comments: formData?.comments,
        amount: parseInt(formData?.amount),
        purpose_id: formData?.purpose,
        transaction: {
          id: id || formData.transaction_id,
          mode: mode || "offline",
          details: {
            receipt_url: receipt_url || pdfData,
            receipt_number: receipt_number,
            cheque_number: cheque_number,
            bank_name: bank_name,
            payment_date: payment_date || new Date(),
          },
        },
        recipient_name: formData?.recipient_name,
        status: status,
      },
    };
  
    axios
      .request(options)
      .then(async function (response) {
        console.log(response.data);
        setOpenOffline(false);
  
        const downloadPdf = async (url) => {
          try {
            const confirmResult = await Swal.fire({
              title: "Download Receipt PDF?",
              text: "Do you want to download the receipt PDF?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Download",
              cancelButtonText: "Cancel",
            });
  
            if (confirmResult.isConfirmed) {
              const response = await axios.get(url, {
                responseType: "blob", // Important to specify responseType as blob
              });
  
              const blob = new Blob([response.data], {
                type: "application/pdf",
              });
              const urlObject = window.URL.createObjectURL(blob);
  
              // Create a temporary anchor element to trigger the download
              const a = document.createElement("a");
              a.href = urlObject;
              a.download = `SLV_${new Date().toLocaleDateString()}.pdf`; // Specify the file name here
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
  
              // Clean up by revoking the object URL
              window.URL.revokeObjectURL(urlObject);
              await sendEmailPrompt(); // Show email prompt after downloading
            } else {
              Swal.fire("Download Cancelled", "", "info");
              await sendEmailPrompt(); // Show email prompt even if download is cancelled
            }
          } catch (error) {
            console.error("Error downloading PDF:", error);
            Swal.fire({
              text: "Error downloading receipt PDF.",
              icon: "error",
            });
            await sendEmailPrompt(); // Show email prompt even if there's an error
          }
        };
  
        // Trigger PDF download with the receipt URL
        await downloadPdf(receipt_url ? receipt_url : pdfData);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  
  const sendEmailPrompt = async () => {
    const { value: email } = await Swal.fire({
      title: "Send Receipt via Email?",
      input: "email",
      inputLabel: "Enter email address",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true,
      confirmButtonText: "Send Email",
      cancelButtonText: "Cancel",
    });
  
    if (email) {
      const serviceID = "service_47d9vgi";
      const templateID = "template_8th4gfh";
      const userID = "T-Mrf-HKduN8T0vwj";
      const htmlContent = `
  <p style="text-align: center;">SRI LAKSHMI VENKATARAMANA TEMPLE</p>
  <p style="text-align: center;">Durga, Karkala Taluk, Udupi District, Karnataka - 576117</p>
  <p>Phone: +91 72042 13913</p>
  <p>Email: slv.durga.temple@gmail.com</p>
  <p>Receipt No: ${formData.transaction_id}</p>
  <p>Date: ${new Date()}</p>
  <p>Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}</p>
  <p>For the purpose of ${formData.purpose}</p>
  <p>A sum of Rupees: Rs.${formData.amount}</p>
  <p>Order ID: ${formData.transaction_id}</p>
  <p>Thanks & Regards</p>
  <p>Managing Trustee</p>
`;

  
      const templateParams = {
        to_name: currentUser.data.first_name,
        to_email: email, // Email recipient
        from_name: "SLV-Temple-Durga", // Sender's name
        message_html: htmlContent,
      };
  
      emailjs
        .send(serviceID, templateID, templateParams, userID)
        .then((result) => {
          console.log(result.text); // Log success message
          Swal.fire({
            text: "Email sent successfully.",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error); // Log error message
          Swal.fire({
            text: "Error sending email.",
            icon: "error",
          });
        });
    } else {
      Swal.fire("Email sending cancelled", "", "info");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearFormData = () => {
    setFormData({
      user_id: "",
      comments: "",
      purpose: "",
      amount: "",
      transaction_id: "",
      transaction_mode: "",
      receipt_url: "",
      receipt_number: "",
      cheque_number: "",
      bank_name: "",
      payment_date: "",
      recipient_name: "",
      status: "",
    });
  };

  const isFormComplete =
    formData.comments && formData.purpose && formData.amount;

  return (
    <div className="make-booking">
      <header
        style={{
          background:
            "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
          textAlign: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <h1>Make A Donation</h1>
        <HomeIcon
          className="home"
          fontSize="large"
          onClick={() => navigate("/dashboard")}
          style={{ position: "fixed", top: "20px", right: "20px" }}
        />
      </header>

      <Box
        component="form"
        sx={{
          backgroundColor: "white",
          margin: "0 auto",
          maxWidth: "600px",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          required
          fullWidth
          label="Comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          select
          required
          fullWidth
          label="Purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        >
          {purposes &&
            purposes.map((purpose) => (
              <MenuItem key={purpose.id} value={purpose.id}>
                {purpose.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          required
          fullWidth
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          disabled={!isFormComplete}
          color="primary"
          sx={{ mt: 2, width: "100%" }}
          onClick={handleOpen}
          startIcon={<PaymentIcon />}
        >
          Proceed
        </Button>
      </Box>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-description"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              Amount: Rs.{formData.amount}
            </Typography>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleCheckout}
                startIcon={<PaymentIcon />}
              >
                Pay Now
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenOffline}
                startIcon={<CurrencyRupeeIcon />}
                sx={{ backgroundColor: "black" }}
              >
                Pay Offline
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={openOffline}
          onClose={handleCloseOffline}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter Details
            </Typography>
            <TextField
              fullWidth
              label="Transaction ID"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              style={{ flexGrow: 1 }}
            />
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleCreate}
                startIcon={<PaymentIcon />}
                sx={{ margin: "8px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseOffline}
                sx={{ margin: "8px" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ClientDonation;