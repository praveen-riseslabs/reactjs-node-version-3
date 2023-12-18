import {
  Avatar,
  Badge,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { getUserDetails, logoutUser, setActiveChat } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/useThunk";

function Header() {
  const [groupedNotifications, setGroupedNotifications] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //extracting user state and loggedIn state from store
  const { user, loggedIn } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.chat);

  const [doGetUserDetails, loadingUserDetails] = useThunk(getUserDetails);

  //handling opening/closing of menu upon clicking user avatar
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCLoseMenu = () => setAnchorEl(null);

  //menu item : profile
  const handleProfileClick = () => {
    navigate("/profile");
  };

  //menu item : reset password
  const handleResetPasswordClick = () => {
    navigate(`/resetpassword/${user.userId}`);
  };

  //menu item : logout
  const handleLogoutClick = () => {
    dispatch(logoutUser());
  };

  //click on notification
  const handleNotificationClick = (id) => {
    dispatch(setActiveChat({ _id: id }));
    setIsNotificationsPanelOpen(false);
  };

  //navigating if user is logged in
  useEffect(() => {
    if (loggedIn) doGetUserDetails(user?.userId);
  }, [loggedIn, doGetUserDetails, user?.userId]);

  //grouping notifications by chatname and sender username
  useEffect(() => {
    const updatedNotifications = Object.groupBy(notifications, (notification) =>
      notification.chatName
        ? notification.chatName
        : notification.sender.username
    );
    setGroupedNotifications(updatedNotifications);
  }, [notifications]);
  
  //mapping over notification array
  const renderedNotifications = Object.keys(groupedNotifications).map(
    (notif) => {
      return (
        <span
          key={notif}
          className="bg-dark rounded p-1 d-flex flex-column"
          role="button"
        >
          <span style={{ color: "#8a2be2", fontSize: "0.8rem" }}>{notif}</span>
          {groupedNotifications[notif] &&
            groupedNotifications[notif].map((note) => {
              return !note.chatName ? (
                <span
                  key={note._id}
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => handleNotificationClick(note.chatId)}
                >
                  {note.message}
                </span>
              ) : (
                <span
                  key={note._id}
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => handleNotificationClick(note.chatId)}
                >
                  {note.sender.username} : {note.message}
                </span>
              );
            })}
        </span>
      );
    }
  );

  return (
    <div className="p-2 bg-dark text-white d-flex justify-content-between align-items-center">
      {/* search bar */}
      <div className="offset-1 input-group" style={{ width: "60%" }}>
        <button className="btn btn-primary bg-secondary border-0">
          <SearchIcon />
        </button>
        <input
          type="text"
          className="form-control bg-secondary border-0 text-white shadow-none"
          placeholder="Search"
        />
      </div>

      {/* actions */}
      <div className="d-flex justify-content-between align-items-center gap-4">
        {/* notification icon */}
        <div className="position-relative">
          <IconButton
            sx={{
              color: isNotificationsPanelOpen ? "white" : "gray",
              padding: 0,
            }}
            onClick={() =>
              setIsNotificationsPanelOpen(!isNotificationsPanelOpen)
            }
            disabled={!notifications.length}
          >
            <Badge
              badgeContent={notifications.length && notifications.length}
              color="primary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {isNotificationsPanelOpen && (
            <div
              className="position-absolute end-0 bg-dark p-2 rounded z-3"
              style={{ width: "20rem" }}
            >
              <h6
                style={{ fontSize: "0.8rem", color: "#009dff" }}
                className="border-bottom pb-2"
              >
                Notifications
              </h6>
              <div className="d-flex flex-column bg-black rounded p-1 gap-1">
                {renderedNotifications}
              </div>
            </div>
          )}
        </div>

        {/* user avatar button */}
        {loadingUserDetails ? (
          <CircularProgress size={24} />
        ) : (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenMenu}>
            <Avatar alt="user profile avatar" src="https://picsum.photos/200" />
          </IconButton>
        )}
        <Menu anchorEl={anchorEl} open={open} onClose={handleCLoseMenu}>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleResetPasswordClick}>Reset Password</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
