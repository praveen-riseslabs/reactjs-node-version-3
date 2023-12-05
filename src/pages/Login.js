import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useThunk } from "../hooks/useThunk";
import { loginUser } from "../store";
import { useSelector } from "react-redux";

function Login() {
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [doUserLogin, loadingUserLogin, errorLoginUser] = useThunk(loginUser);

  const navigate = useNavigate();

  //extracting loggedIn state from store
  const { loggedIn } = useSelector((state) => state.user);

  //handling inputs
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  //hanldeFormSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    doUserLogin(userData);
  };

  // navigating to dashboard after successful login
  useEffect(() => {
    if (!loggedIn) return;

    navigate("/", { replace: true });
  }, [navigate, loggedIn]);
  
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
            Lo
          </span>
          gin
        </h1>

        {/* user details */}
        <div className="d-flex flex-column gap-3 mt-4">
          <div>
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              className="form-control"
              placeholder="Username or Email"
              value={userData.usernameOrEmail}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* server side error handling */}
        <div className="text-danger mt-3">
          {errorLoginUser && `* ${errorLoginUser}`}
        </div>

        {/* submit button */}
        <div className="d-grid mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loadingUserLogin}
          >
            {loadingUserLogin ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* alt navigation */}
        <div className="mt-2 text-center">
          <div>Forget password</div>
          <div>
            Don't have an Account?{" "}
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </div>
        </div>
      </form>

      {/* notify after successful register */}
      <div
        className="alert alert-success alert-dismissible col-2 position-absolute bottom-0 fade show"
        role="alert"
      >
        Welcome, please login
        <button className="btn-close" data-bs-dismiss="alert"></button>
      </div>
    </div>
  );
}

export default Login;
