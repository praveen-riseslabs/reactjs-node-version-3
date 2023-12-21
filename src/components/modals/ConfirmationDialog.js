import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmationDialog({
  open,
  children,
  title,
  content,
  closeText = "Disagree",
  acceptText = "Agree",
  onDisagree,
  onAccept,
}) {
  return (
    <>
      {children}
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDisagree} variant="contained">{closeText}</Button>
          <Button onClick={onAccept} autoFocus>
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmationDialog;
