import { requestForgotPassword } from "../store";
import { useThunk } from "../hooks/useThunk";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function ForgotPassword() {
  //extracting emailsent state from store
  const { emailSent } = useSelector((state) => state.user);

  const {
    register,
    formState: { isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm({ mode: "all" });

  const [
    doRequestForgotPassword,
    loadingRequestForgotPassword,
    errorRequestForgotPassword,
  ] = useThunk(requestForgotPassword);

  const onSubmitHandler = (data, e) => {
    e.preventDefault();
    doRequestForgotPassword(data.email);

    if (isSubmitSuccessful) {
      reset();
    }
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
        onSubmit={handleSubmit(onSubmitHandler)}
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
              name="email"
              className={`form-control ${
                errorRequestForgotPassword && "is-invalid"
              }`}
              placeholder="Enter your email address"
              {...register("email")}
            />
            <div className="invalid-feedback">Invalid Email</div>
          </div>
        </div>

        {/* submit button */}
        <div className="d-grid mt-3 shadow-lg">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loadingRequestForgotPassword || emailSent}
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

      {/* reset password link sent successfully */}
      {isSubmitSuccessful && emailSent && (
        <div
          className="alert alert-success alert-dismissible col-3 position-absolute bottom-0 fade show"
          role="alert"
        >
          Reset password link sent successfully
          <button className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      ) }
      
      {!emailSent && (
        <div
          className="alert alert-danger alert-dismissible col-3 position-absolute bottom-0 fade show"
          role="alert"
        >
          Error sending reset password link, please try again
          <button className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
