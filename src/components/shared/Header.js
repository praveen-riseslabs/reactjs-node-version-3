import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { getUserDetails, logoutUser } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/useThunk";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //extracting user state and loggedIn state from store
  const { user, loggedIn } = useSelector((state) => state.user);

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

  //navigating if user is logged in
  useEffect(() => {
    if (loggedIn) doGetUserDetails(user?.userId);
  }, [loggedIn, doGetUserDetails, user?.userId]);

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
        <IconButton sx={{ color: "gray", padding: 0 }}>
          <NotificationsIcon />
        </IconButton>

        {/* user avatar button */}
        {loadingUserDetails ? (
          <CircularProgress size={24} />
        ) : (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenMenu}>
            <Avatar alt="aleesf" src="https://picsum.photos/200" />
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
