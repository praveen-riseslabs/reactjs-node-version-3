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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { createGroupChat, searchForUser } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import SearchIcon from "@mui/icons-material/Search";
import { green } from "@mui/material/colors";

function NewGroupChat({isMobile}) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [term, setTerm] = useState("");

  //handle opening and closing of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTerm("");
    setGroupName("");
    setSelectedUsers([]);
    setOpen(false);
  };

  const [doSearchUser, loadingUserSearch, errorLoadingUserSearch] =
    useThunk(searchForUser);

  const [
    doCreateGroupChat,
    loadingCreateGroupChat,
    errorLoadingCreateGroupChat,
  ] = useThunk(createGroupChat);

  const { filteredUser } = useSelector((state) => state.chat);

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
  };

  //handle remove user from selected users list
  const handleUserRemove = (user) => {
    setSelectedUsers((current) => current.filter((c) => c._id !== user._id));
  };

  //handle create group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    const data = {
      name: groupName,
      users: selectedUsers,
    };
    doCreateGroupChat(data);
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
        className="rounded px-2 text-light d-flex flex-sm-column align-items-center justify-content-between"
        style={{ backgroundColor: "#8080801a" }}
        role="button"
        onClick={handleOpen}
      >
        <span className="d-none d-md-inline">New group Chat</span>
        <AddIcon />
      </span>
      <Modal open={open} onClose={handleClose}>
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark
        rounded p-2 text-light"
          style={{ width: isMobile? "50%" :"30%" }}
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h4>Create New Group</h4>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </div>

          {/* content */}
          <form
            className="d-flex flex-column gap-2"
            onSubmit={handleCreateGroup}
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
            {errorLoadingCreateGroupChat && (
              <span className="text-danger">{errorLoadingCreateGroupChat}</span>
            )}
            <Button type="submit" disabled={loadingCreateGroupChat}>
              Create
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default NewGroupChat;
