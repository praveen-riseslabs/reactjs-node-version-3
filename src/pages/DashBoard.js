import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunk } from "../hooks/useThunk";
import { getUserDetails } from "../store";

function DashBoard() {
  //extracting user state and loggedIn state from store
  const { user, loggedIn } = useSelector((state) => state.user);

  const [doGetUserDetails, loadingUserDetails, errorUserDetails] =
    useThunk(getUserDetails);

  //navigating if user is logged in
  useEffect(() => {
    if (loggedIn) doGetUserDetails(user?.email);
  }, [loggedIn, doGetUserDetails, user?.email]);

  return (
    !loadingUserDetails &&
    !errorUserDetails && (
      <div>
        <div>Fullname: {user?.fullname}</div>
        <div>Username : {user?.username}</div>
        <div>Email: {user?.email}</div>
        <div>phoneNumber: {user?.phoneNumber}</div>
        <div>Gender: {user?.gender}</div>
      </div>
    )
  );
}

export default DashBoard;
