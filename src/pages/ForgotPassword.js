import { useState } from "react";
import { requestForgotPassword } from "../store";
import { useThunk } from "../hooks/useThunk";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  
  const [doRequestForgotPassword, loadingRequestForgotPassword, errorRequestForgotPassword] = useThunk(requestForgotPassword)

  const handleSubmit = (e) => {
    e.preventDefault();
    doRequestForgotPassword(email)
  };

  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #009dff, #8a2be2)",
      }}
    >
      <form
        className="position-absolute top-50 start-50 translate-middle border p-4 rounded bg-light"
        style={{ width: "40rem" }}
        onSubmit={handleSubmit}
      >
        <h1>
          <span
            style={{
              borderBottom: "3px solid",
              borderImage: "linear-gradient(to right, #009dff, #8a2be2) 1",
            }}
          >
            Forgot
          </span>
          -Password
        </h1>

        {/* email field */}
        <div className="d-flex flex-column gap-3 mt-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${
                errorRequestForgotPassword && "is-invalid"
              }`}
              placeholder="Enter your email address"
              value={email}
              onChange={e=> setEmail(e.target.value)}
            />
            <div className="invalid-feedback">Invalid Email</div>
          </div>
        </div>

        {/* server side error handling */}
        <div className="text-danger mt-3">
          {errorRequestForgotPassword && `* ${errorRequestForgotPassword}`}
        </div>

        {/* submit button */}
        <div className="d-grid mt-3 shadow-lg">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loadingRequestForgotPassword || errorRequestForgotPassword}
          >
            {loadingRequestForgotPassword ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Send Reset Password Code"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
