import { Snackbar, Alert } from "@mui/material";

export default function Toast({ message, type }) {
  const open = Boolean(message);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}   // disappears after 3 seconds
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={type || "info"}  // success | error | warning | info
        variant="filled"
        sx={{
          borderRadius: 2,
          fontWeight: 500,
          minWidth: 250
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
