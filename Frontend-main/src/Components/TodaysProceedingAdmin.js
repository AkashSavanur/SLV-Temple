import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import { Divider } from "@mui/material";

export default function TodaysProceedingAdmin() {
    const [event, setEvent] = useState(null);
    const [relationships, setRelationships] = useState(null);
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();

    const currentDate = `${month}-${day}-${year}`;

    const fetchRelationships = async (id) => {
        try {
            const options = {
                method: "POST",
                url: "https://api.kiruthirupathi.org/relationship/get",
                headers: { Authorization: currentUser.auth_token },
                data: {
                    user_id: id,
                },
            };

            const response = await axios.request(options);
            setRelationships(response.data.data);
            console.log(response);
        } catch (error) {
            console.error("Error fetching relationships:", error);
        }
    };

    const relationStyle = {
        marginBottom: '10px',
        color: 'black'
    }

    const eventStyle = {
        backgroundColor: '#f8f9fa',
        color: 'rgb(0, 0, 0)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
    };

    const headingStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        color: 'rgb(0, 0, 0)',
        fontSize: '32px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    };

    const detailStyle = {
        marginBottom: '10px',
    };

    useEffect(() => {
        const options = {
            method: "GET",
            url: `https://api.kiruthirupathi.org/adoptaday/today/${currentDate}`,
            headers: { Authorization: currentUser?.auth_token },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log('response from proceedings', response.data);
                setEvent(response.data[0]);
                fetchRelationships(response.data[0].user_id);
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [currentDate, currentUser?.auth_token]);

    return (
        <div style={eventStyle}>
            {event? (
                <div>
                    <h1 style={headingStyle}>Today's Proceeding</h1>
                    <div style={detailStyle}><strong>Name:</strong> {event.user.first_name} {event.user.last_name}</div>
                    <div style={detailStyle}><strong>Occasion:</strong> {event.occasion}</div>
                    <div style={detailStyle}><strong>Email:</strong> {event.user.email}</div>
                    <div style={detailStyle}><strong>Phone Number:</strong> {event.user.phone_number}</div>
                    <div style={detailStyle}><strong>Total Cost:</strong> ₹{(event.rate.annualExpenses + event.rate.endowment + event.rate.maintenance + event.rate.miscellaneous + event.rate.priestsHonorarium).toLocaleString()}</div>
                    <div style={detailStyle}><strong>Gothra:</strong> {event.user.gothra}</div>
                    <div style={detailStyle}><strong>Nakshatra:</strong> {event.user.nakshatra}</div>
                    <div style={detailStyle}><strong>Rashi:</strong> {event.user.rashi}</div>
                    {event.relationship ?
                        <div style={detailStyle}><strong>On Behalf Of:</strong>  {event.relationship?.details?.first_name} {event.relationship?.details?.last_name} ({event.relationship?.relation})</div>
                        :
                        null
                    }

                    <Divider />
                    {relationships && relationships.length > 0 ? (
                        relationships.map((relationship, index) => (
                            <div key={index}>
                                <h3 style={relationStyle}>{relationship.relation}</h3>
                                <div style={detailStyle}><strong>Name:</strong> {relationship?.details?.first_name} {relationship?.details?.last_name}</div>
                                <div style={detailStyle}><strong>Nakshatra:</strong> {relationship?.details?.nakshatra}</div>
                                <div style={detailStyle}><strong>Gothra:</strong> {relationship?.details?.gothra}</div>
                                <div style={detailStyle}><strong>Rashi:</strong> {relationship?.details?.rashi}</div>
                                <Divider />
                            </div>
                        ))
                    ) : (
                        <p>No relationships</p>
                    )}
                </div>
            ) : (
                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No event today</p>
            )}
        </div>
    );
}