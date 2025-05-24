import React, { useState, useEffect } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import axios from "axios";
import Swal from "sweetalert2";
import PaymentIcon from "@mui/icons-material/Payment";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import image from "./image";
import { Checkbox, FormControlLabel } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";

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

const MakeBooking = () => {
  const API_URL = "https://api.kiruthirupathi.org/adoptaday/create";
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [relationship, setRelationship] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rate, setRate] = useState([]);
  const [checked, setChecked] = useState(false);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };
  // Modal
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    fetchRate();
    if (
      formData.start_date &&
      formData.end_date &&
      formData.relationship_id &&
      formData.occasion &&
      formData.recurring) {
      if (
        (!currentUser.data.DOB ||
          !currentUser.data.nakshatra ||
          !currentUser.data.gothra ||
          !currentUser.data.rashi) &&
        formData.relationship_id == "self"
      ) {
        Swal.fire({
          text: "Complete your profile before making a booking",
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/profile')
          }
        });
        return;
      }
    } else {
      Swal.fire({
        text: "Incomplete Form",
        icon: "error",
      })
      return;
    }


    const updatedRelationshipId =
      formData.relationship_id === "self" ? null : formData.relationship_id;

    const behalf_relationship = relationship.find(
      (relation) => relation.id === formData.relationship_id
    );
    if (updatedRelationshipId) {
      if (
        !behalf_relationship.details.DOB ||
        !behalf_relationship.details.email ||
        !behalf_relationship.details.nakshatra ||
        !behalf_relationship.details.gothra ||
        !behalf_relationship.details.rashi
      ) {
        Swal.fire({
          text: "Complete your relationship's profile before creating a booking. Go to My Relations for this.",
        });
        return;
      }
    }

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
        .then((response) => {
          const updatedUser = { ...currentUser, data: response.data };
          setCurrentUser(updatedUser);
        })
        .catch((error) => console.error(error));
    }
  }, [currentUser]);

  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/relationship/get",
      headers: { Authorization: currentUser.auth_token },
      data: { user_id: currentUser?.data?.id },
    };

    axios
      .request(options)
      .then((response) => setRelationship(response.data.data))
      .catch((error) => console.error(error));
  }, [currentUser?.auth_token, currentUser?.data?.id]);

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    booking_status: "",
    relationship_id: "",
    transaction_id: "",
    transaction_mode: "",
    transaction_details_receipt_url: "",
    transaction_details_cheque_number: "",
    transaction_details_bank_name: "",
    transaction_details_payment_date: "",
    recipient_name: "Sri Lakshmi Ventratramana Temple",
    occasion: "",
    recurring: "",
    comments: "",
  });

  /*  useEffect(() => {
    
  
    fetchRate();
  }, [formData.start_date, currentUser.auth_token]); */

  const fetchRate = async () => {
    try {
      const rateOptions = {
        method: "POST",
        url: "https://api.kiruthirupathi.org/rates/effectivePrice",
        headers: { Authorization: currentUser.auth_token },
        data: { date: formData.start_date },
      };

      const response = await axios.request(rateOptions);
      setRate(response.data?.prevRate);
      console.log(response.data?.prevRate); // Ensure you're getting the expected rate
    } catch (error) {
      console.error("Error fetching rate:", error);
    }
  };

  useEffect(() => {
    const startDateParam = new URLSearchParams(location.search).get(
      "startDate"
    );
    if (startDateParam) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        start_date: startDateParam,
      }));
    }
  }, [location.search]);

  const handleCheckout = async (e) => {
    handleClose();

    if (
      (!currentUser.data.DOB ||
        !currentUser.data.nakshatra ||
        !currentUser.data.gothra ||
        !currentUser.data.rashi) &&
      formData.relationship_id == "self"
    ) {
      Swal.fire({
        text: "Complete your profile before making a booking",
        icon: "error",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/profile')
        }
      });
      return;
    }

    const rateOptions = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/rates/effectivePrice",
      headers: { Authorization: currentUser.auth_token },
      data: { date: formData.start_date },
    };

    try {
      const rateResponse = await axios.request(rateOptions);
      console.log("rateResponse", rateResponse);
      const effectivePrice =
        rateResponse.data.totalSum *
        100 *
        generateDateRange(formData.start_date, formData.end_date).dates.length;
      console.log("rate response", rateResponse.data.totalSum);
      console.log(
        "length",
        generateDateRange(formData.start_date, formData.end_date).dates.length
      );
      console.log("effectve price", effectivePrice);

      const checkoutOptions = {
        method: "POST",
        url: "https://api.kiruthirupathi.org/checkout/create",
        headers: { Authorization: currentUser.auth_token },
        data: { amount: effectivePrice },
      };

      const checkoutResponse = await axios.request(checkoutOptions);

      const rzpOptions = {
        key: "rzp_test_LRoMzlrK7O7ZzL",
        amount: effectivePrice,
        name: "Sri Lakshmi Venkatramana Temple",
        description: "Donation",
        order_id: checkoutResponse?.data?.order?.id,
        handler: async function (rzpResponse) {
          const body = {
            ...rzpResponse,
            order_id: checkoutResponse.data?.order.id,
          };

          try {
            const validateResponse = await fetch(
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

            if (!validateResponse.ok) {
              throw new Error("Network response was not ok");
            }

            const jsonres = await validateResponse.json();
            console.log("makebookig jsonres", jsonres);

            if (validateResponse.status === 201) {
              const miliseconds = jsonres.details.created_at * 1000;
              const paymentDate = new Date(miliseconds);

              console.log(updatedRelationshipId);

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
                `Receipt No: ${checkoutResponse.data.order.receipt}`,
                margin,
                130
              ); // Adjust vertical position
              doc.text(`Date: ${paymentDate}`, margin, 140); // Adjust vertical position

              // Donor Details
              doc.text(
                `Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}`,
                margin,
                160
              ); // Adjust vertical position
              doc.text(`For the occasion of ${formData.occasion}`, margin, 170); // Adjust vertical position

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
                          <p>Receipt No: ${checkoutResponse.data.order.receipt}</p>
                          <p>Date: ${paymentDate}</p>
                          <p>Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name}</p>
                          <p>For the occasion of ${formData.occasion}</p>
                          <p>A sum of Rupees: Rs.${jsonres.details.amount/100}</p>
                          <p>Order ID: ${checkoutResponse?.data?.order?.id}</p>
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

              handleSubmit(
                e,
                jsonres.payment_id,
                jsonres.details.method,
                pdfData,
                checkoutResponse?.data.order.receipt,
                null,
                jsonres.details.bank,
                paymentDate,
                checked
              );
              Swal.fire({
                text: "Payment Success!",
                icon: "success",
                timer: 2000,
              });
            }
          } catch (error) {
            console.error("Error validating payment:", error);
          }
        },
        notes: { address: "Doozie Software Solutions" },
        theme: { color: "#3399cc" },
      };
      const behalf_relationship = relationship.find(
        (relation) => relation.id === formData.relationship_id
      );
      const updatedRelationshipId =
        formData.relationship_id === "self" ? null : formData.relationship_id;

      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log("diffdays ", diffDays);
      console.log(
        "diffdays",
        generateDateRange(formData.start_date, formData.end_date).dates.length +
        generateDateRange(formData.start_date, formData.end_date)
          .unavailable_dates.length
      );
      var rzp1 = new window.Razorpay(rzpOptions);
      rzp1.on("payment.failed", function (response) {
        Swal.fire({ text: "Payment invalid" });
      });
      if (endDate < startDate) {
        Swal.fire({
          text: "End date must be after start date",
          icon: "error",
        });
        return;
      } else if (diffDays > 5) {
        Swal.fire({
          text: "Cannot book more than 5 consecutive days.",
          icon: "error",
        });
        return;
      } else if (
        (diffDays + 1) * formData.recurring >
        generateDateRange(formData.start_date, formData.end_date).dates.length
      ) {
        console.log("diffdays is more than range");
        const { isConfirmed } = await Swal.fire({
          text: `Booking Date(s) unavailable: ${generateDateRange(
            formData.start_date,
            formData.end_date
          ).unavailable_dates.join(
            ", "
          )}.Do you want to book available dates only?`,
          showCancelButton: true,
          confirmButtonText: "Yes",
        });

        if (!isConfirmed) {
          return;
        } else {
          rzp1.open();
        }
      } else if (updatedRelationshipId) {
        if (
          !behalf_relationship.details.DOB ||
          !behalf_relationship.details.nakshatra ||
          !behalf_relationship.details.gothra ||
          !behalf_relationship.details.rashi
        ) {
          Swal.fire({
            text: "Complete your relationship's profile before creating a booking. Go to My Relations for this.",
          });
          return;
        } else {
          rzp1.open();
        }
      } else {
        rzp1.open();
      }
    } catch (error) {
      console.error("Error during checkout process:", error);
    }
  };

  const handleSubmit = async (
    e,
    id,
    mode,
    receipt_url,
    receipt_number,
    cheque_number,
    bank_name,
    payment_date,
    checked
  ) => {
    e.preventDefault();
    handleCloseOffline();
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const dates = generateDateRange(startDate, endDate).dates;
      const updatedRelationshipId =
        formData.relationship_id === "self" ? null : formData.relationship_id;

      const effectivePrice =
        dates.length *
        (rate?.annualExpenses +
          rate?.endowment +
          rate?.maintenance +
          rate?.miscellaneous +
          rate?.priestsHonorarium +
          rate?.priests_contingency);
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

      // Donor Details
      doc.text(
        `Received with thanks from: ${currentUser.data.first_name} ${currentUser.data.last_name} `,
        margin,
        160
      ); // Adjust vertical position
      doc.text(`For the occasion of ${formData.occasion} `, margin, 170); // Adjust vertical position

      // Amount Details
      doc.text(`A sum of Rupees: ${effectivePrice} `, margin, 190); // Adjust vertical position
      doc.text(`Rs ${effectivePrice} `, margin, 200); // Adjust vertical position

      // Closing
      doc.text(`Thanks & Regards`, margin, 220); // Adjust vertical position
      doc.text(`Managing Trustee`, margin, 240); // Adjust vertical position

      const pdfData = doc.output("dataurlstring");

      const bookingPromises = dates.map((date) => {
        const status = openOffline ? "pending" : "completed";
        const options = {
          method: "POST",
          url: API_URL,
          headers: {
            "Content-Type": "application/json",
            Authorization: currentUser?.auth_token,
          },
          data: {
            user_id: currentUser.data.id,
            date: date,
            booking_status: status,
            relationship_id: updatedRelationshipId,
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
            recipient_name: formData.recipient_name,
            occasion: formData.occasion,
            comments: formData.comments,
            announce: checked
          },
        };

        return axios.request(options);
      });

      const responses = await Promise.all(bookingPromises);

      responses.forEach((response) => {
        if (response.status === 502) {
          throw new Error("502 Bad Gateway Error");
        }
      });
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

            const blob = new Blob([response.data], { type: "application/pdf" });
            const urlObject = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = urlObject;
            a.download = "receipt.pdf"; // Specify the file name here
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up by revoking the object URL
            window.URL.revokeObjectURL(urlObject);
          } else {
            Swal.fire("Download Cancelled", "", "info");
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
          Swal.fire({
            text: "Error downloading receipt PDF.",
            icon: "error",
          });
        }
      };

      // Trigger PDF download with the receipt URL
      await downloadPdf(pdfData);

      clearFormData();

      console.log("Bookings created successfully!");
      clearFormData();
    } catch (error) {
      if (error.response && error.response.status === 502) {
        Swal.fire({
          text: "Booking Date is unavailable",
        });
      } else {
        Swal.fire({
          text: "Error creating bookings.",
        });
      }
    }
  };

  const clearFormData = () => {
    setFormData({
      start_date: "",
      end_date: "",
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
      recurring: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_date") {
      setFormData((prevData) => ({
        ...prevData,
        start_date: value,
        end_date: "",
      }));
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClickHome = () => {
    navigate("/dashboard");
  };

  const addYears = (date, years) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  };

  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const unavailable_dates = [];
    for (let i = 0; i < formData.recurring; i++) {
      let currentDate = addYears(new Date(startDate), i);
      let lastDate = addYears(new Date(endDate), i);
      while (currentDate <= lastDate) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        console.log(`Checking availability for date: ${formattedDate} `);
        if (isAvailable(formattedDate)) {
          console.log(`Date ${formattedDate} is available`);
          dates.push(formattedDate);
        } else {
          console.log(`Date ${formattedDate} is not available`);
          unavailable_dates.push(formattedDate);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    console.log(dates);
    return {
      dates: dates,
      unavailable_dates: unavailable_dates,
    };
  };

  const isAvailable = (dateStr) => {
    const currentDate = dayjs(dateStr);
    const available =
      currentDate.isAfter(dayjs(), "day") &&
      !bookings.some(
        (booking) => dayjs(booking.date).format("YYYY-MM-DD") === dateStr
      );
    console.log(`isAvailable for ${dateStr}: ${available} `);
    return available;
  };



  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://api.kiruthirupathi.org/adoptaday/getAll",
      headers: { Authorization: currentUser?.auth_token },
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
  }, []);







  return (
    <div className="make-booking">
      <HomeIcon
        className="home"
        fontSize="large"
        onClick={handleClickHome}
        style={{ position: "fixed", top: "20px", right: "20px" }}
      />
      <header
        style={{
          background:
            "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
          textAlign: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <h1>Adopt A Day</h1>
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
        <center>
          <Button
            variant="contained"
            onClick={() => navigate("/adopt-a-day-client")}
            style={{
              textAlign: "center",
              backgroundColor: "purple",
              marginRight: "20px"
            }}
          >
            View Calendar
          </Button>
          {currentUser?.data?.roles?.isAdmin ? <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChecked}
                style={{
                  color: "purple",

                }}
              />
            }
            label="Notify Everyone"
            labelPlacement="start"
          /> : null}

        </center>
        <TextField
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box display="flex" alignItems="center">
          <TextField
            select
            fullWidth
            label="On behalf of"
            name="relationship_id"
            value={formData.relationship_id}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            style={{ flexGrow: 1 }}
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
          <Button
            onClick={() =>
              navigate(`/relationships/${currentUser.data.id}?startDate=${formData.start_date}`)
            }
            variant="outlined"
            color="primary"
            style={{ marginLeft: 8 }}
            startIcon={<AddIcon />}
          >
            Add/Edit Relationship
          </Button>
        </Box>
        <TextField
          label="Occasion"
          name="occasion"
          type="text"
          value={formData.occasion}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          required
          fullWidth
          label="Recurring"
          name="recurring"
          value={formData.recurring}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="1">1 year</MenuItem>
          <MenuItem value="2">2 years</MenuItem>
          <MenuItem value="3">3 years</MenuItem>
          <MenuItem value="4">4 years</MenuItem>
          <MenuItem value="5">5 years</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: "100%" }}
          onClick={handleOpen}
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Daily Rate Breakdown:
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Annual Expenses: Rs.{rate?.annualExpenses}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Endowment: Rs.{rate?.endowment}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Maintenance: Rs.{rate?.maintenance}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Miscellaneous: Rs.{rate?.miscellaneous}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Priest's Honorarium: Rs.{rate?.priestsHonorarium}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Priest's Contingency: Rs.{rate?.priests_contingency}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              Total: Rs.
              {rate?.annualExpenses +
                rate?.endowment +
                rate?.maintenance +
                rate?.miscellaneous +
                rate?.priestsHonorarium +
                rate?.priests_contingency}
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
                style={{
                  backgroundColor: "black",
                }}
                onClick={handleOpenOffline}
                startIcon={<CurrencyRupeeIcon />}
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
            <TextField
              fullWidth
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              style={{ flexGrow: 1 }}
            />
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
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

export default MakeBooking;