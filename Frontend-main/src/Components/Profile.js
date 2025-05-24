import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import NakshatraRashi from "../JSON/NakshatraRashi.json";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Checkbox,
  TextField,
} from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const [userFetched, setUserFetched] = useState(false);
  const [user, setUser] = useState(null); // Initialize user state
  const [editedValues, setEditedValues] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (currentUser?.auth_token && !userFetched) {
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
          setUser(response.data); // Set the user data here
          setEditedValues(response.data);
          setUserFetched(true);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [currentUser, setCurrentUser, userFetched]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedValues(user); // Reset edited values to the original user data
  };

  const handleSave = () => {
    setEditing(false);

    const updatedUser = { ...user, ...editedValues };
    saveUpdatedUserData(updatedUser);
  };

  const saveUpdatedUserData = (updatedUserData) => {
    const bdate = new Date(updatedUserData?.DOB).toISOString();

    const options = {
      method: "PUT",
      url: `https://api.kiruthirupathi.org/user/update/${updatedUserData.id}`,
      headers: { Authorization: currentUser?.auth_token },
      data: {
        first_name: updatedUserData?.first_name,
        last_name: updatedUserData?.last_name,
        DOB: bdate,
        email: updatedUserData?.email,
        phone_number: updatedUserData?.phone_number,
        nakshatra: updatedUserData?.nakshatra,
        rashi: updatedUserData?.rashi,
        gothra: updatedUserData?.gothra,
        roles: {
          isDonor: updatedUserData?.roles?.isDonor,
          isAdoptor: updatedUserData?.roles?.isAdoptor,
          isAdmin: updatedUserData?.roles?.isAdmin,
        },
        address: {
          street: updatedUserData?.address?.street,
          city: updatedUserData?.address?.city,
          state: updatedUserData?.address?.state,
          zip_code: updatedUserData?.address?.zip_code,
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const me = {
          ...currentUser,
          auth_token: response.headers.auth_token,
        };

        console.log("Updated User:", me);

        setCurrentUser(me);
        setUser(updatedUserData); // Update the user state with the new data
      })
      .then(() => {
        window.location.reload();
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleChange = (event, field) => {
    setEditedValues({ ...editedValues, [field]: event.target.value });
  };

  const handleChangeAddress = (e, field) => {
    const { value } = e.target;
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      address: {
        ...prevEditedValues.address,
        [field]: value,
      },
    }));
  };

  const handleChangeCheckbox = (e, objectField, field) => {
    const { checked } = e.target;
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [objectField]: {
        ...prevEditedValues[objectField],
        [field]: checked,
      },
    }));
  };

  const handleClick = () => {
    navigate(`/dashboard`);
  };

  return (
    <div>
      <header>
        <h1>Profile</h1>
      </header>
      <IconButton
        onClick={handleClick}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "black",
        }}
      >
        <HomeIcon fontSize="large" />
      </IconButton>
      <center>
        <div
          style={{
            backgroundColor: "rgb(255, 248, 231)",
            padding: "20px",
            marginTop: "20px",
            width: "80%",
            marginBottom: "2rem",
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>{user?.first_name || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>{user?.last_name || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="date"
                        value={editedValues.DOB || ""}
                        onChange={(e) => handleChange(e, "DOB")}
                      />
                    ) : user?.DOB ? (
                      new Date(user.DOB).toLocaleDateString()
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email (Optional)</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.email || ""}
                        onChange={(e) => handleChange(e, "email")}
                      />
                    ) : (
                      user?.email || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>{user?.phone_number || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nakshatra</TableCell>
                  <TableCell>
                    {editing ? (
                      <Select
                        labelId="nakshatra-label"
                        value={editedValues.nakshatra || ""}
                        onChange={(e) => handleChange(e, "nakshatra")}
                        label="Nakshatra"
                      >
                        {NakshatraRashi?.nakshatraNames?.map(
                          (nakshatra, index) => (
                            <MenuItem key={index} value={nakshatra}>
                              {nakshatra}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    ) : (
                      user?.nakshatra || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rashi</TableCell>
                  <TableCell>
                    {editing ? (
                      <Select
                        labelId="rashi-label"
                        value={editedValues.rashi || ""}
                        onChange={(e) => handleChange(e, "rashi")}
                        label="Rashi"
                      >
                        {NakshatraRashi?.rashiNames?.map((rashi, index) => (
                          <MenuItem key={index} value={rashi}>
                            {rashi}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      user?.rashi || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gothra</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.gothra || ""}
                        onChange={(e) => handleChange(e, "gothra")}
                      />
                    ) : (
                      user?.gothra || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>
                    {
                      <Checkbox
                        checked={user?.roles?.isDonor || false}
                        disabled
                      />
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Adoptor</TableCell>
                  <TableCell>
                    {
                      <Checkbox
                        checked={user?.roles?.isAdoptor || false}
                        disabled
                      />
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    {
                      <Checkbox
                        checked={user?.roles?.isAdmin || false}
                        disabled
                      />
                    }
                  </TableCell>
                </TableRow>
                <h2>Address (Optional)</h2>
                <TableRow>
                  <TableCell>Street</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.address?.street || ""}
                        onChange={(e) => handleChangeAddress(e, "street")}
                      />
                    ) : (
                      user?.address?.street || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>City</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.address?.city || ""}
                        onChange={(e) => handleChangeAddress(e, "city")}
                      />
                    ) : (
                      user?.address?.city || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>State</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.address?.state || ""}
                        onChange={(e) => handleChangeAddress(e, "state")}
                      />
                    ) : (
                      user?.address?.state || ""
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Zip Code</TableCell>
                  <TableCell>
                    {editing ? (
                      <TextField
                        type="text"
                        value={editedValues.address?.zip_code || ""}
                        onChange={(e) => handleChangeAddress(e, "zip_code")}
                      />
                    ) : (
                      user?.address?.zip_code || ""
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {editing ? (
            <div>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
      </center>
    </div>
  );
};

export default Profile;
