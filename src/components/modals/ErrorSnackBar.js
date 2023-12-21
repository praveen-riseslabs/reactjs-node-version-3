import { Alert, Snackbar } from "@mui/material";

function ErrorSnackBar({
  open,
  autoHideDuration,
  onClose,
  note,
  severity = "error",
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      style={{ width: "20rem" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {note}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackBar;
