import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";

export default function TodaysProceeding() {
    const [event, setEvent] = useState(null);
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();

    const currentDate = `${month}-${day}-${year}`;

    useEffect(() => {
        const options = {
            method: "GET",
            url: `https://api.kiruthirupathi.org/adoptaday/today/${currentDate}`,
            headers: { Authorization: currentUser?.auth_token },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log('response from proceedings', response.data)
                setEvent(response.data[0])
            })
            .catch(function (error) {
                console.error(error);
            });
    }, []);

    const eventStyle = {
        backgroundColor: 'rgb(255, 248, 231)',
        color: 'rgb(255, 69, 0)',
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
        color: 'rgb(255, 69, 0)',
        fontSize: '32px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    };

    const detailStyle = {
        marginBottom: '10px',
    };

    return (
        <div style={eventStyle}>
            {event ? (
                <div>
                    <h1 style={headingStyle}>Today's Proceeding</h1>
                    <div style={detailStyle}><strong>Name:</strong> {event.user.first_name} {event.user.last_name}</div>
                    <div style={detailStyle}><strong>Occasion:</strong> {event.occasion}</div>
                </div>
            ) : (
                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No event today</p>
            )}
        </div>
    );
}
