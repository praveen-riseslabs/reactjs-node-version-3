import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useThunk } from "../hooks/useThunk";
import { facebookLogin, googleLogin, loginUser } from "../store";
import { useSelector } from "react-redux";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Divider } from "@mui/material";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { Facebook, Google } from "../services/sso";

function Login() {
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [doUserLogin, loadingUserLogin, errorLoginUser] = useThunk(loginUser);
  const [doGoogleLogin, loadingGoogleLogin] = useThunk(googleLogin);
  const [doFacebookLogin, loadingFacebookLogin] = useThunk(facebookLogin);

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

  //handle google login successful
  const handleGoogleLoginSucesss = (res) => {
    //sending jwt token from google
    const userData = {
      token: res.credential,
      clientId: res.clientId,
    };
    doGoogleLogin(userData);
  };

  //handle google login successful
  const handleFacebookLoginSuccess = ({ provider, data }) => {
    const userData = {
      email: data.email,
      username: data.name,
      fullname: `${data.first_name} ${data.last_name}`,
      facebookId: data.userID,
    };
    doFacebookLogin(userData);
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
            disabled={
              loadingUserLogin || loadingGoogleLogin || loadingFacebookLogin
            }
          >
            {loadingUserLogin || loadingGoogleLogin || loadingFacebookLogin ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center mt-2 fw-light">Or</div>
          {/* //SSO login methods */}
          <div className="d-flex mt-2 justify-content-around align-items-center">
            {/* google login */}
            <GoogleOAuthProvider clientId={Google.CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSucesss}
                onError={() => console.log("failed")}
                text="Continue with google"
              />
            </GoogleOAuthProvider>

            {/* facebook login */}
            <LoginSocialFacebook
              appId={Facebook.APP_ID}
              onResolve={handleFacebookLoginSuccess}
              onReject={(err) => err}
            >
              <FacebookLoginButton
                size="2.5rem"
                style={{ width: "12rem", fontSize: "0.8rem" }}
                text="Continue with facebook"
              />
            </LoginSocialFacebook>
          </div>
        </div>

        <Divider
          sx={{ marginBlock: "1rem", backgroundColor: "gray" }}
        ></Divider>
        {/* alt navigation */}
        <div className="text-center">
          <Link to="/forgotpassword" className="text-decoration-none">
            Forget password
          </Link>
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
