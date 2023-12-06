import { useForm } from "react-hook-form";
import { validate } from "../constants/registrationFormValidation";
import { useThunk } from "../hooks/useThunk";
import { resetPassword } from "../store";
import {useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

function ResetPassword() {
  const [doResetPassword, loadingResetPassword, errorResetPassword] =
    useThunk(resetPassword);

  const { userId } = useParams();

  const navigate = useNavigate();

  const {
    reset,
    register,
    formState: { errors, isSubmitSuccessful },
    getValues,
    handleSubmit,
  } = useForm({ mode: "all" });
  const { newPassword, confirmPassword } = getValues();

  const onSubmitHandler = (data, e) => {
    e.preventDefault();

    const config = {
      newPassword: data.newPassword,
      userId,
    };

    doResetPassword(config);

    if (isSubmitSuccessful) {
      reset();
    }
  };

  //navigating after successful reseting password
  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate("/login", { replace: true });
    }
  }, [isSubmitSuccessful, navigate]);

  //navigating if userId is undefined
  useEffect(() => {
    if (userId === "undefined") {
      navigate("/login", { replace: true });
    }
  }, [navigate, userId]);

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
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <h1>
          <span
            style={{
              borderBottom: "3px solid",
              borderImage: "linear-gradient(to right, #009dff, #8a2be2) 1",
            }}
          >
            Reset
          </span>
          -Password
        </h1>

        {/* new password */}
        <div className="d-flex flex-column gap-3 mt-4">
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className={`form-control ${
                errors.newPassword?.message && "is-invalid"
              }`}
              placeholder="Enter your new password"
              {...register("newPassword", validate.password)}
            />
            <div className="invalid-feedback">
              {errors.newPassword?.message}
            </div>
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${
                confirmPassword !== newPassword && "is-invalid"
              }`}
              placeholder="Enter Confirm Password"
              {...register("confirmPassword")}
            />
            <div className="invalid-feedback">
              Confirm password needs to match the password
            </div>
          </div>
        </div>

        {/* server side error handling */}
        <div className="text-danger mt-3">
          {errorResetPassword && `* ${errorResetPassword}`}
        </div>

        {/* submit button */}
        <div className="d-grid mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loadingResetPassword || errorResetPassword}
          >
            {loadingResetPassword ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
