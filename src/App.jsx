import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' }
    },
    shape: {
      borderRadius: 12
    },
    typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* App Background */}
      <Box
        sx={{
          minHeight: "100vh",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0f172a, #020617)"
              : "linear-gradient(135deg, #f8fafc, #eef2ff)",
          transition: "0.3s ease"
        }}
      >
        {/* Floating Theme Toggle */}
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'background.paper',
            borderRadius: '50%',
            boxShadow: 3
          }}
        >
          <IconButton onClick={() => setDarkMode(!darkMode)} color="primary">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Dashboard />
      </Box>
    </ThemeProvider>
  );
}
