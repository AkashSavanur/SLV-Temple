import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function Purposes() {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
    const [purposes, setPurposes] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const options = {
            method: 'POST',
            url: 'https://api.kiruthirupathi.org/purposes/get',
            headers: { Authorization: currentUser.auth_token }
        };

        axios.request(options)
            .then(function (response) {
                console.log(response);
                setPurposes(response.data.data);
            }).catch(function (error) {
                console.error(error);
            });
    }, [currentUser.auth_token]);

    const handleClick1 = () => {
        navigate("/dashboard");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if both fields are not empty
        if (!formData.name || !formData.description) {
            alert('Both name and description fields are required.');
            return;
        }

        console.log('Form Data Submitted:', formData);
        const options = {
            method: 'POST',
            url: 'https://api.kiruthirupathi.org/purposes/create',
            headers: { Authorization: currentUser.auth_token },
            data: formData
        };

        axios.request(options)
            .then(function (response) {
                console.log(response);
                setPurposes(response.data.data);
            }).catch(function (error) {
                console.error(error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleReset = () => {
        setFormData({
            name: '',
            description: ''
        });
    };

    const styles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: '10px'
        },
        formContainer: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        formGroup: {
            marginBottom: '15px',
        },
        label: {
            marginBottom: '5px',
            fontWeight: 'bold',
        },
        input: {
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        button: {
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
        },
        createButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
        },
        resetButton: {
            backgroundColor: '#f44336',
            color: 'white',
        },
    };

    return (
        <div style={{overflowX: "hidden"}}>
            <header
                style={{
                    background:
                        "linear-gradient(to right, rgb(38, 179, 251), rgb(249, 178, 0))",
                    color: "black",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <h1>Manage Donation Purposes</h1>
                <HomeIcon className="home" fontSize="large" onClick={handleClick1} />
            </header>
            <div style={styles.body}>
                <div style={styles.formContainer}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label htmlFor="name" style={styles.label}>Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="description" style={styles.label}>Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.buttons}>
                            <button type="submit" style={{ ...styles.button, ...styles.createButton }}>CREATE</button>
                            <button type="button" onClick={handleReset} style={{ ...styles.button, ...styles.resetButton }}>RESET</button>
                        </div>
                    </form>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purposes && purposes.length > 0 ? purposes.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.description}</TableCell>
                            </TableRow>
                        )) : <LinearProgress />}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}