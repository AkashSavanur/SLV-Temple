import React from 'react';
import { useNavigate } from 'react-router-dom';

const DonationBox = () => {
    const navigate = useNavigate()
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                textAlign: 'center',
                backgroundColor: 'white',
                width: '60vw',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ marginBottom: '1rem' }}>Support Our Cause</h1>
                <button style={{
                    backgroundColor: '#ff4500',
                    color: 'white',
                    fontSize: '1.5rem',
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer'
                }} onClick={() => {
                    navigate('/donor-client')
                }}>
                    DONATE NOW
                </button>
            </div>
        </div>
    );
}

export default DonationBox;
