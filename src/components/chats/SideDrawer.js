import { Avatar, Button, CircularProgress, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { createChat, searchForUser } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import { useSelector } from "react-redux";

function SideDrawer() {
  const [term, setTerm] = useState("");
  const [doSearchUser, loadingUserSearch, errorLoadingUserSearch] =
    useThunk(searchForUser);
  const [doAccessSingleChat, loadingSingleChat, errorLoadingSingleChat] =
    useThunk(createChat);

  const { filteredUser } = useSelector((state) => state.chat);

  //search for user
  const handleSearch = (e) => {
    e.preventDefault();
    if (!term) return;
    doSearchUser(term);
  };

  //handle searched user click
  const handleUserClick = (id) => {
    doAccessSingleChat(id);
  };

  //handling searched user and rendering them
  let results = Array.from({ length: 10 });
  if (loadingUserSearch) {
    results = results.map((_, i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        sx={{ width: "100%" }}
        height={60}
      />
    ));
  } else if (errorLoadingUserSearch) {
    results = <div className="text-danger">Something went wrong</div>;
  } else {
    results = filteredUser.map((user) => {
      return (
        <div
          key={user._id}
          className="d-flex gap-3 align-items-center shadow p-1"
          role="button"
          onClick={() => handleUserClick(user._id)}
          data-bs-dismiss={
            !loadingSingleChat && !errorLoadingSingleChat && "offcanvas"
          }
        >
          <Avatar sx={{ padding: 0, margin: 0 }} />
          <div className="d-flex flex-column">
            <span className="fw-bold">{user.username}</span>
            <span>{user.fullname}</span>
          </div>
          {loadingSingleChat && <CircularProgress size={24} />}
          {errorLoadingSingleChat && (
            <div className="text-danger">Error...</div>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <Button
        className="navbar-toggler mx-3"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDarkNavbar"
        sx={{ width: "10rem", color: "gray" }}
        startIcon={<SearchIcon />}
      >
        Search User
      </Button>
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex="-1"
        id="offcanvasDarkNavbar"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
            Search for Users
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form className="d-flex mt-3" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              onChange={(e) => setTerm(e.target.value)}
            />
            <button
              className="btn btn-success"
              type="submit"
              onClick={handleSearch}
              disabled={!term}
            >
              Search
            </button>
          </form>

          {/* //searched results */}
          <div className="mt-3">
            <p>Results</p>
            <div>{results}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideDrawer;
