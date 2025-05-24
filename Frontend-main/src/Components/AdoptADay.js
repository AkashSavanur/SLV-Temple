import React from 'react';
import AdoptADayButton from './AdoptADayButton';
import HomeIcon from '@mui/icons-material/Home';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

const AdoptADay = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  // Theme setup similar to Dashboard component
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Adjust primary color to your preference
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'black'
        }}
      >
        <HomeIcon fontSize="large" />
      </IconButton>
      <Container component="main" maxWidth="xs" sx={{ position: 'relative' }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <EventAvailableIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Adopt A Day
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              mt: 3,
            }}
          >
            <div
              className="button-grid-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '5rem'
              }}
            >
              <AdoptADayButton title="Configure Price" path="/adopt-a-day/configure" />
              <AdoptADayButton title="View Bookings" path="/adopt-a-day/bookings" />
            </div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AdoptADay;
