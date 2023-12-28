import MenuIcon from "@mui/icons-material/Menu";
import { CircularProgress, IconButton, Switch } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useThunk } from "../../hooks/useThunk";
import { fetchCoords, toggleTracking } from "../../store";
import ErrorSnackBar from "../modals/ErrorSnackBar";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

function TimelineMenu({ distance, enabled }) {
  const [open, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [
    doFetchCoords,
    fetchingCoordsLoading,
    errorFetchingCoords,
    resetErrorFetchingCoords,
  ] = useThunk(fetchCoords);

  const [
    doToggleTracking,
    loadingToggleTracking,
    errorToggleTracking,
    resetErrorToggleTracking,
  ] = useThunk(toggleTracking);

  //opening/closing of drawer
  const handleDrawerClose = () => setIsOpen(false);
  const handleDrawerOpen = () => setIsOpen(true);

  //fetching coords if months and year details are filled
  const handleFindClick = () => {
    if (!selectedDate) return;

    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    doFetchCoords(formattedDate);
  };

  return (
    <div
      className="position-absolute z-3 w-75 h-25"
      style={{ maxWidth: "30rem" }}
    >
      {!open ? (
        <IconButton
          className="hover m-1"
          onClick={handleDrawerOpen}
          sx={{ bgcolor: "white" }}
          disableRipple
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <div className="bg-dark w-100 h-100 m-1 p-2 rounded">
          {/* header */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <h6>Timeline</h6>
              {/* tracking toggle */}
              {loadingToggleTracking ? (
                <CircularProgress size={12} />
              ) : (
                <Switch
                  onChange={(e) => doToggleTracking(e.target.checked)}
                  checked={enabled}
                />
              )}
            </div>
            {/* close drawer */}
            <IconButton
              onClick={handleDrawerClose}
              className="hover text-white"
            >
              <CloseIcon />
            </IconButton>
          </div>
          {/* body */}
          <div className="input-group">
            {/* date picker */}
            <DatePicker
              onChange={setSelectedDate}
              value={selectedDate}
              calendarIcon={null}
              className="bg-secondary p-2 form-control border-0"
              calendarClassName={"text-black"}
              format="dd-MM-yyyy"
            />
            <button onClick={handleFindClick} className="input-group-text">
              {fetchingCoordsLoading ? <CircularProgress size={15} /> : "Find"}
            </button>
          </div>
          {/* details */}
          <span>Distance traveled: {distance}</span>
        </div>
      )}

      {/* //handling error */}
      {/* coords */}
      <ErrorSnackBar
        open={Boolean(errorFetchingCoords)}
        onClose={resetErrorFetchingCoords}
        note={errorFetchingCoords}
        autoHideDuration={4000}
      />

      {/* toggling tracking */}
      <ErrorSnackBar
        open={Boolean(errorToggleTracking)}
        onClose={resetErrorToggleTracking}
        note={"failed to toggle tracking"}
        autoHideDuration={4000}
      />
    </div>
  );
}

export default TimelineMenu;
