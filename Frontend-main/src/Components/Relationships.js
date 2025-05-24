import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import { MuiTelInput } from "mui-tel-input";
import NakshatraRashi from "../JSON/NakshatraRashi.json";
import RelationshipsJSON from "../JSON/Relationships.json";
import { ArrowBack } from "@mui/icons-material";

export default function Relationships() {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
    const location = useLocation();
    const userID = useParams();
    const startDateParam = new URLSearchParams(location.search).get("startDate");
    const [relationship, setRelationship] = useState(null);
    const [formData, setFormData] = useState({
        user_id: userID.id,
        relation: "",
        details: {
            first_name: "",
            last_name: "",
            DOB: "",
            email: "",
            phone_number: "",
            nakshatra: "", // Changed to empty string for initial state
            rashi: "", // Changed to empty string for initial state
            gothra: "",
            street: "",
            city: "",
            state: "",
            zip_code: "",
        },
    });
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRelationships = async () => {
            try {
                const options = {
                    method: "POST",
                    url: "https://api.kiruthirupathi.org/relationship/get",
                    headers: { Authorization: currentUser.auth_token },
                    data: {
                        user_id: userID.id,
                    },
                };

                const response = await axios.request(options);
                setRelationship(response.data.data);
            } catch (error) {
                console.error("Error fetching relationships:", error);
            }
        };

        fetchRelationships();
    }, [currentUser.auth_token, userID.id]);

    const handleClickHome = () => {
        navigate("/dashboard");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { relation, details } = formData;
        const { first_name, last_name, nakshatra, rashi } = details;
        if (!relation || !first_name || !last_name || !nakshatra || !rashi) {
            Swal.fire({
                text: "All fields are required.",
                icon: "error",
            });
            return;
        }

        try {
            const options = {
                method: "POST",
                url: "https://api.kiruthirupathi.org/relationship/create",
                headers: { Authorization: currentUser.auth_token },
                data: formData,
            };

            const response = await axios.request(options);
            setRelationship(response.data);
            setShowForm(false);
            setEditMode(false);
            setEditIndex(null);
            window.location.reload();
        } catch (error) {
            console.error("Error creating relationship:", error);
            Swal.fire({
                text: "Error creating relationship. Please try again later.",
                icon: "error",
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { relation, details } = formData;
        const { first_name, last_name, nakshatra, rashi } = details;
        if (!relation || !first_name || !last_name || !nakshatra || !rashi) {
            Swal.fire({
                text: "All fields are required.",
                icon: "error",
            });
            return;
        }

        try {
            const options = {
                method: "PUT",
                url: `https://api.kiruthirupathi.org/relationship/update/${editIndex}`,
                headers: { Authorization: currentUser.auth_token },
                data: formData,
            };

            const response = await axios.request(options);
            setRelationship(response.data.data);
            setShowForm(false);
            setEditMode(false);
            setEditIndex(null);
            window.location.reload();
        } catch (error) {
            console.error("Error updating relationship:", error);
            Swal.fire({
                text: "Error updating relationship. Please try again later.",
                icon: "error",
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            if (name.startsWith("details.")) {
                const detailsField = name.split(".")[1];
                return {
                    ...prevFormData,
                    details: {
                        ...prevFormData.details,
                        [detailsField]: value,
                    },
                };
            }
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };

    const handlePhoneChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            details: {
                ...prevFormData.details,
                phone_number: value,
            },
        }));
    };

    const handleReset = () => {
        setFormData({
            relation: "",
            details: {
                first_name: "",
                last_name: "",
                DOB: "",
                email: "",
                phone_number: "",
                nakshatra: "",
                rashi: "",
                gothra: "",
                street: "",
                city: "",
                state: "",
                zip_code: "",
            },
        });
        setEditMode(false);
        setEditIndex(null);
        setShowForm(false);
    };

    const handleEdit = (relation) => {
        setFormData({
            relation: relation.relation,
            details: {
                first_name: relation.details?.first_name || "",
                last_name: relation.details?.last_name || "",
                DOB: relation.details?.DOB || "",
                email: relation.details?.email || "",
                phone_number: relation.details?.phone_number || "",
                nakshatra: relation.details?.nakshatra || "",
                rashi: relation.details?.rashi || "",
                gothra: relation.details?.gothra || "",
                street: relation.details?.street || "",
                city: relation.details?.city || "",
                state: relation.details?.state || "",
                zip_code: relation.details?.zip_code || "",
            },
        });
        setShowForm(true);
        setEditMode(true);
        setEditIndex(relation.id);
    };

    const handleDelete = async (relation) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const options = {
                    method: "DELETE",
                    url: `https://api.kiruthirupathi.org/relationship/delete/${relation.id}`,
                    headers: { Authorization: currentUser.auth_token },
                };

                const response = await axios.request(options);
                const updatedRelationships = relationship.filter(
                    (item) => item.id !== relation.id
                );
                setRelationship(updatedRelationships);
                Swal.fire("Deleted!", "The relationship has been deleted.", "success");
            }
        } catch (error) {
            console.error("Error deleting relationship:", error);
            Swal.fire({
                text: "Error deleting relationship. Please try again later.",
                icon: "error",
            });
        }
    };

    const handleGoBack = () => {
        navigate("/book-adopt-a-day");
    };

    return (
        <div style={{ overflowX: "hidden" }}>
            <header
                style={{
                    background:
                        "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
                    color: "black",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <h1>Manage Relationships</h1>
                <HomeIcon
                    className="home"
                    fontSize="large"
                    onClick={handleClickHome}
                    style={{ cursor: "pointer" }}
                />
            </header>
            <div
                style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            >
                <div style={{ maxWidth: "800px", width: "100%" }}>

                    {!showForm && (
                        <center>
                            <Button
                                variant="contained"
                                onClick={() => setShowForm(true)}
                                style={{
                                    marginBottom: "20px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    marginRight: "5px",
                                }}
                            >
                                Add Relationship
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigate(`/book-adopt-a-day?startDate=${startDateParam}`)
                                }}
                                style={{
                                    marginBottom: "20px",
                                    marginLeft: "5px",
                                    backgroundColor: "yellow",
                                    color: "black",
                                }}
                            >
                                Go to Adopt A Day
                            </Button>

                        </center>
                    )}
                    {showForm && (
                        <Paper
                            style={{
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <form onSubmit={editMode ? handleUpdate : handleSubmit}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <h2>
                                        {editMode ? "Edit Relationship" : "Add New Relationship"}
                                    </h2>
                                    <IconButton
                                        onClick={() => setShowForm(false)}
                                        style={{ marginLeft: "auto", color: red[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>

                                <Select
                                    labelId="relation-label"
                                    value={formData.relation}
                                    onChange={handleChange}
                                    name="relation"
                                    label="Relation"
                                    required
                                    fullWidth
                                    style={{ marginBottom: '20px' }}
                                >
                                    {RelationshipsJSON?.map((relationship, index) => (
                                        <MenuItem key={index} value={relationship}>
                                            {relationship}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    fullWidth
                                    required
                                    name="details.first_name"
                                    label="First Name"
                                    variant="outlined"
                                    value={formData.details.first_name}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    name="details.last_name"
                                    label="Last Name"
                                    variant="outlined"
                                    value={formData.details.last_name}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    name="details.DOB"
                                    label="Date of Birth"
                                    type="date"
                                    variant="outlined"
                                    value={formData.details.DOB}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="details.email"
                                    label="Email"
                                    variant="outlined"
                                    value={formData.details.email}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <MuiTelInput
                                    fullWidth
                                    name="details.phone_number"
                                    label="Phone Number"
                                    variant="outlined"
                                    value={formData.details.phone_number}
                                    onChange={handlePhoneChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <Select
                                    labelId="nakshatra-label"
                                    value={formData.details.nakshatra}
                                    onChange={handleChange}
                                    label="Nakshatra"
                                    required
                                    fullWidth
                                    name="details.nakshatra"
                                    style={{ marginBottom: "20px" }}
                                >
                                    {NakshatraRashi?.nakshatraNames?.map((nakshatra, index) => (
                                        <MenuItem key={index} value={nakshatra}>
                                            {nakshatra}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    labelId="rashi-label"
                                    value={formData.details.rashi}
                                    onChange={handleChange}
                                    label="Rashi"
                                    required
                                    fullWidth
                                    name="details.rashi"
                                    style={{ marginBottom: "20px" }}
                                >
                                    {NakshatraRashi?.rashiNames?.map((rashi, index) => (
                                        <MenuItem key={index} value={rashi}>
                                            {rashi}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    fullWidth
                                    name="details.gothra"
                                    label="Gothra"
                                    variant="outlined"
                                    value={formData.details.gothra}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    name="details.street"
                                    label="Street"
                                    variant="outlined"
                                    value={formData.details.street}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    name="details.city"
                                    label="City"
                                    variant="outlined"
                                    value={formData.details.city}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    name="details.state"
                                    label="State"
                                    variant="outlined"
                                    value={formData.details.state}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <TextField
                                    fullWidth
                                    name="details.zip_code"
                                    label="Zip Code"
                                    variant="outlined"
                                    value={formData.details.zip_code}
                                    onChange={handleChange}
                                    style={{ marginBottom: "20px" }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Button variant="contained" onClick={handleReset}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        style={{ backgroundColor: "#4CAF50", color: "white" }}
                                    >
                                        {editMode ? "Update" : "Save"}
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    )}
                </div>
            </div>
            <div
                style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            >
                <TableContainer component={Paper} style={{ width: "100%" }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Relation</TableCell>
                                <TableCell>Relation First Name</TableCell>
                                <TableCell>Relation Last Name</TableCell>
                                <TableCell>Relation DOB</TableCell>
                                <TableCell>Relation Email</TableCell>
                                <TableCell>Relation Phone Number</TableCell>
                                <TableCell>Relation Nakshatra</TableCell>
                                <TableCell>Relation Rashi</TableCell>
                                <TableCell>Relation Gothra</TableCell>
                                <TableCell>Relation Street (Address)</TableCell>
                                <TableCell>Relation City (Address)</TableCell>
                                <TableCell>Relation State (Address)</TableCell>
                                <TableCell>Relation PIN (Address)</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relationship &&
                                relationship.length > 0 &&
                                relationship.map((relation) => (
                                    <TableRow key={relation.id}>
                                        <TableCell component="th" scope="row">
                                            {relation.relation}
                                        </TableCell>
                                        <TableCell>{relation.details?.first_name}</TableCell>
                                        <TableCell>{relation.details?.last_name}</TableCell>
                                        <TableCell>{relation.details?.DOB}</TableCell>
                                        <TableCell>{relation.details?.email}</TableCell>
                                        <TableCell>{relation.details?.phone_number}</TableCell>
                                        <TableCell>{relation.details?.nakshatra}</TableCell>
                                        <TableCell>{relation.details?.rashi}</TableCell>
                                        <TableCell>{relation.details?.gothra}</TableCell>
                                        <TableCell>{relation.details?.street}</TableCell>
                                        <TableCell>{relation.details?.city}</TableCell>
                                        <TableCell>{relation.details?.state}</TableCell>
                                        <TableCell>{relation.details?.zip_code}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleEdit(relation)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(relation)}>
                                                <DeleteIcon sx={{ color: red[500] }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}