import { useNavigate, useParams } from "react-router-dom";
import { useThunk } from "../hooks/useThunk";
import { verifyUser } from "../store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function VerifyEmail() {
  const { token } = useParams();

  const navigate = useNavigate();

  //extracting isVerified state from store
  const { isVerified } = useSelector((state) => state.user);

  const [doVerifyEmail, verificationInProgress, errorVerification] =
    useThunk(verifyUser);

  //click on verify button
  const handleVerifyClick = () => {
    doVerifyEmail(token);
  };

  //navigating to login page upon verifying the email
  useEffect(() => {
    if (isVerified) {
      navigate("/login", { replace: true });
    }
  }, [isVerified, navigate]);

  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #009dff, #8a2be2)",
      }}
    >
      <div className="position-absolute top-50 start-50 translate-middle border p-4 rounded bg-light d-flex align-items-center flex-column">
        <h3>Click below button to verify your email!</h3>
        <button
          style={{
            background: "linear-gradient(to right, #009dff, #8a2be2)",
          }}
          className="btn btn-primary mt-3 px-5 py-2 fs-5 fw-bold"
          onClick={handleVerifyClick}
          disabled={verificationInProgress || errorVerification}
        >
          {verificationInProgress ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            "Verify"
          )}
        </button>
        <span>{errorVerification && errorVerification}</span>
      </div>
    </div>
  );
}

export default VerifyEmail;
