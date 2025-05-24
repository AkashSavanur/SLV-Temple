import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PriceTable from "./PriceTable";
import axios from "axios";
import { currentUserState } from "./Atoms";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import { LinearProgress, TextField, Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
const ConfigurePrice = () => {
  const API_URL = "https://api.kiruthirupathi.org/rates";
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [showPopUp, setShowPopUp] = useState(false)
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/donor-management/update-donor");
  };

  const handleClick1 = () => {
    navigate("/dashboard");
  };

  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    effective_date: "",
    priest_honorarium: "",
    annual_expenses: "",
    maintenance: "",
    endowment: "",
    miscellaneous: "",
    priests_contingency: ""
  });

  const [createRate, setCreateRate] = useState({
    effectiveDate: "",
    priestHonorarium: "",
    annualExpenses: "",
    maintenance: "",
    endowment: "",
    miscellaneous: ""
  })
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const options = {
        method: 'POST',
        url: 'https://api.kiruthirupathi.org/rates/get',
        headers: { Authorization: currentUser?.auth_token }
      };

      axios.request(options)
        .then(function (response) {
          console.log('rates response', response)
          setPrices(response.data.data);
        }).catch(function (error) {
          console.error(error);
        });
    };
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormData({
      effective_date: "",
      priest_honorarium: "",
      annual_expenses: "",
      maintenance: "",
      endowment: "",
      miscellaneous: "",
    });
    setEditId(null);
  };

  const handleCreate = async () => {
    const date = new Date(formData.effective_date).toISOString();
    const options = {
      method: 'POST',
      url: 'https://api.kiruthirupathi.org/rates/create',
      headers: { Authorization: currentUser.auth_token },
      data: {
        effectiveDate: date,
        priestsHonorarium: parseInt(formData.priest_honorarium, 10),
        annualExpenses: parseInt(formData.annual_expenses, 10),
        maintenance: parseInt(formData.maintenance, 10),
        endowment: parseInt(formData.endowment, 10),
        miscellaneous: parseInt(formData.miscellaneous, 10),
        priests_contingency: parseInt(formData.priests_contingency, 10)
      }
    };
    axios.request(options)
      .then(function (response) {
        console.log("creation", response.data);
        window.location.reload()
        if (response.response.status === 400) {
          throw new Error("400 Bad Gateway Error");
        }
        window.location.reload()
      }).catch(function (error) {
        if (error.response && error.response.status === 400) {
        Swal.fire({
          text: "Please select future date",
          icon: "error"
        });
      }
        console.error(error);
      });
  };

  const handleUpdate = async (id) => {
    const date = new Date(formData.effective_date).toISOString();
    const options = {
      method: 'PUT',
      url: `https://api.kiruthirupathi.org/rates/update/${id}`,
      headers: { Authorization: currentUser.auth_token },
      data: {
        effectiveDate: date,
        priestsHonorarium: parseInt(formData.priest_honorarium, 10),
        annualExpenses: parseInt(formData.annual_expenses, 10),
        maintenance: parseInt(formData.maintenance, 10),
        endowment: parseInt(formData.endowment, 10),
        miscellaneous: parseInt(formData.miscellaneous, 10)
      }
    };
    axios.request(options)
      .then(function (response) {
        console.log(response.data);
        window.location.reload()
      }).catch(function (error) {
        if (error.response.status === 400) {
          Swal.fire({
            text: error.response.data.error,
            icon: 'error'
          })
        }
        console.error(error);
      });
  };

  const handleDelete = async (id) => {
    const confirmation = prompt(
      `To confirm deletion, type "delete rate"`
    );

    if (
      confirmation ===
      `delete rate`
    ) {
      try {
        const options = {
          method: "DELETE",
          url: `https://api.kiruthirupathi.org/rates/delete/${id}`,
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
      alert(
        "Deletion cancelled. Please type 'delete' followed by the user's first name and last name to confirm deletion."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (price) => {
    setFormData({
      effective_date: price.effectiveDate,
      priest_honorarium: price.priestsHonorarium,
      annual_expenses: price.annualExpenses,
      maintenance: price.maintenance,
      endowment: price.endowment,
      miscellaneous: price.miscellaneous,
    });
    setEditId(price.id);
  };

  const handleSubmit = () => {
    if (editId) {
      handleUpdate(editId);
    } else {
      handleCreate();
    }
  };


  return (
    <div className="configure-prices">
      <header>
        <div>
          <h1>Configure Prices</h1>
          

        </div>

        <HomeIcon className="home" fontSize="large" onClick={handleClick1} />
      </header>
      <center>
      {showPopUp ? null : <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={() => {
            setShowPopUp(true)
          }}>Add Rate</Button>}
          </center>
      {(editId || showPopUp) && (
        <Box sx={{ maxWidth: 800, margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="effective_date"
                label="Effective Date"
                value={formData.effective_date}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="priest_honorarium"
                label="Priest Honorarium"
                value={formData.priest_honorarium}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="priests_contingency"
                label="Priest's Contingency"
                value={formData.priests_contingency}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="annual_expenses"
                label="Annual Festival Expenses"
                value={formData.annual_expenses}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="maintenance"
                label="Maintenance"
                value={formData.maintenance}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="endowment"
                label="Endowment"
                value={formData.endowment}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="miscellaneous"
                label="Miscellaneous"
                value={formData.miscellaneous}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth onClick={handleSubmit} variant="contained" color="primary">
                {editId ? "Update Price" : "Add Price"}
              </Button>
              <Button fullWidth onClick={() => {
                setShowPopUp(false)
                setEditId(null)
              }} variant="contained" color="secondary" style={{
                marginTop: '10px'
              }}>
                Close Form
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {prices && prices.length > 0 ? (
        <div className="price-table-container">
          <PriceTable prices={prices} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      ) : (
        <LinearProgress />
      )}

      <style jsx>{`
        .configure-prices {
          margin: 20px;
        }

        header {
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

        h1 {
          align-items: center;
          color: black;
        }

        .home {
          color: black;
          position: absolute;
          left: right;
          top: 20px;
          cursor: pointer;
        }

        .price-table-container {
          background-color: white;
          margin-top: 20px;
          max-width: 100%;
          overflow-x: auto;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default ConfigurePrice;
