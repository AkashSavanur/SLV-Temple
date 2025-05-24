import React from 'react';
import doozieSoftLogo from '../img/dooziesoft_logo.png';

const Copyright = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.content}>
                <p style={styles.copyright}>
                    COPYRIGHT © 2024 - 25 Sri Lakshmi Venkataramana Temple - ALL RIGHTS RESERVED
                </p>
                <p style={styles.design}>
                    Developed by Sanjay Marathe and Akash Savanur
                </p>
                <p style={styles.design}>
                    Development Partner: Doozie Software Solutions
                </p>
                <img 
                    src={doozieSoftLogo} 
                    style={styles.logo} 
                    onClick={() => {
                        window.location.href = 'https://dooziesoft.com';
                    }}
                    alt="Doozie Software Solutions Logo"
                />
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e7e7e7',
        width: '100%',
    },
    content: {
        textAlign: 'center',
        maxWidth: '100%',
        overflowWrap: 'break-word',
    },
    copyright: {
        fontSize: '16px',
        color: '#333',
        margin: '5px 0',
        fontFamily: 'Arial, sans-serif',
        wordWrap: 'break-word',
    },
    design: {
        fontSize: '16px',
        color: '#777',
        margin: '5px 0',
        fontFamily: 'Arial, sans-serif',
        wordWrap: 'break-word',
    },
    logo: {
        width: 'auto',
        height: '5vw',
        maxWidth: '100%',
    },
};

export default Copyright;
