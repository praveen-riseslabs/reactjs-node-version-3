import {
  Avatar,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Modal,
  Skeleton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import {
  addUserToGroupChat,
  deleteGroup,
  removeUserFromGroupChat,
  renameGroupChat,
  searchForUser,
} from "../../store";
import { useThunk } from "../../hooks/useThunk";
import SearchIcon from "@mui/icons-material/Search";
import { green } from "@mui/material/colors";
import SettingsIcon from "@mui/icons-material/Settings";

function GroupChatEdit({ activeChat, isMobile }) {
  const { filteredUser } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(activeChat.chatName);

  const users = activeChat.users.filter((u) => u._id !== user.userId);

  const [selectedUsers, setSelectedUsers] = useState([...users]);
  const [term, setTerm] = useState("");

  //handle opening and closing of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [doSearchUser, loadingUserSearch, errorLoadingUserSearch] =
    useThunk(searchForUser);
  const [doRenameGroupName, loadingRenamingGroupName, errorRenamingGroupName] =
    useThunk(renameGroupChat);
  const [doAddUser, loadingAddingUser, errorAddingUser] =
    useThunk(addUserToGroupChat);
  const [doRemoveUser, loadingRemovingUser, errorRemovingUser] = useThunk(
    removeUserFromGroupChat
  );
  const [doDeleteChat] = useThunk(deleteGroup);

  const error = errorRenamingGroupName || errorAddingUser || errorRemovingUser;

  //search for user
  const handleSearch = () => {
    if (!term) return;
    doSearchUser(term);
  };

  //handle user click
  const handleUserClick = (user) => {
    selectedUsers.includes(user)
      ? setSelectedUsers((current) => current.filter((c) => c._id !== user._id))
      : setSelectedUsers([...selectedUsers, user]);
    doAddUser({ chatId: activeChat._id, userId: user._id });
  };

  //handle remove user from selected users list
  const handleUserRemove = (user) => {
    setSelectedUsers((current) => current.filter((c) => c._id !== user._id));
    doRemoveUser({ chatId: activeChat._id, userId: user._id });
  };

  //handle Delete Group
  const handleDeleteGroup = () => {
    doDeleteChat({
      chatId: activeChat._id,
      adminId: activeChat.groupAdmin._id,
    });
  };

  //handle create group
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!groupName) return;

    doRenameGroupName({ name: groupName, chatId: activeChat._id });

    handleClose();
  };

  //handling searched user and rendering them
  let results;
  if (loadingUserSearch) {
    results = (
      <Skeleton variant="rectangular" sx={{ width: "100%" }} height={60} />
    );
  } else if (errorLoadingUserSearch) {
    results = <div className="text-danger">Something went wrong</div>;
  } else {
    results = filteredUser.slice(0, 8).map((user) => {
      return (
        <div
          key={user._id}
          className="d-flex gap-3 align-items-center shadow p-1 my-1 rounded"
          role="button"
          onClick={() => handleUserClick(user)}
          style={{
            backgroundColor: selectedUsers.some((u) => u._id === user._id)
              ? green[700]
              : "transparent",
          }}
        >
          <Avatar sx={{ padding: 0, margin: 0 }} />
          <div className="d-flex flex-column">
            <span className="fw-bold">{user.username}</span>
            <span>{user.fullname}</span>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <span
        className="rounded px-2 text-light d-flex align-items-center justify-content-between"
        style={{ backgroundColor: "#8080801a" }}
        role="button"
        onClick={handleOpen}
      >
        <SettingsIcon />
      </span>
      <Modal open={open} onClose={handleClose}>
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark
        rounded p-2 text-light"
          style={{ width: isMobile ? "50%" : "30%" }}
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h4>{activeChat.chatName}</h4>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </div>

          {/* content */}
          <form
            className="d-flex flex-column gap-2"
            onSubmit={handleSaveChanges}
          >
            <input
              type="text"
              className="form-control shadow-none"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{ fontSize: "1.1rem" }}
            />
            <TextField
              placeholder="Search for users to add"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "0.5rem" }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    role="button"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="mt-2 d-flex flex-wrap gap-2">
              {selectedUsers.map((user) => {
                return (
                  <Chip
                    key={user._id}
                    label={user.username}
                    variant="outlined"
                    onDelete={() => handleUserRemove(user)}
                    sx={{ backgroundColor: "#8a2be2", border: "none" }}
                  />
                );
              })}
            </div>
            <div
              className="overflow-auto scroll-none"
              style={{ height: "15rem" }}
            >
              {results}
            </div>
            {error && <span className="text-danger">{error}</span>}
            <Button
              onClick={handleDeleteGroup}
              disabled={
                loadingRenamingGroupName ||
                loadingRemovingUser ||
                loadingAddingUser
              }
              variant="contained"
              color="error"
              sx={{ width: "10rem", alignSelf: "end" }}
            >
              delete group
            </Button>
            <Button
              type="submit"
              disabled={
                loadingRenamingGroupName ||
                loadingRemovingUser ||
                loadingAddingUser
              }
            >
              Save Changes
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default GroupChatEdit;
