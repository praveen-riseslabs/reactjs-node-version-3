import { useSelector } from "react-redux";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { green } from "@mui/material/colors";

function Profile() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="container bg-black px-3">
      <h3 className="py-2 fw-bold">Profile</h3>
      <div className="g-0">
        <div className="bg-dark p-2 col-3 rounded mb-3 d-flex flex-column gap-1">
          <div className="border-bottom pb-2 d-flex align-items-center gap-2">
            <span className="fs-5 font-monospace">{user.username}</span>
            {user.isVerified ? (
              <CheckCircleOutlineIcon sx={{ padding: 0, color:green[500] }} />
            ) : (
              <span className="text-danger">not-verified</span>
            )}
          </div>
          <span className="">{user.fullname}</span>
          <span className="">{user.gender}</span>
        </div>
        <div className="bg-dark p-2 col-3 rounded d-flex flex-column gap-2">
          <span className="pb-2 border-bottom fs-5">Contact Info</span>
          <span className="">Email : {user.email}</span>
          <span className="">Number : {user.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
