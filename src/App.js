import axios from "axios";
import { useState } from "react";

function App() {
  //registration form state
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [confirmPassword, setCOnfirmPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // [a-zA-Z0-9_]: Matches any uppercase letter, lowercase letter, digit, or underscore.
  // {3,20}: Specifies that the username should be between 3 and 20 characters in length.
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

  //specifies that password length should be at least 8 and contains at least one number.
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  //[789]: Matches either '7', '8', or '9', which are the starting digits of Indian phone numbers.
  // \d{9}: Matches exactly 9 digits after the starting digit.
  const phoneNumberPattern = /^[789]\d{9}$/;

  //   [a-zA-Z0-9._%+-]+: Matches one or more word characters (alphanumeric), dots, underscores, percent signs, plus signs, or hyphens for the local part of the email address.
  // @gmail\.com: Matches the literal characters "@gmail.com".
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword !== userData.password)
        throw Error("confirm password is incorrect");
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_SERVER_API}/user/register`, {
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        gender,
      });
      setError("");
    } catch (err) {
      setLoading(false);
      // state for getting server side errors
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
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
        onSubmit={handleFormSubmit}
      >
        <h1>
          <span
            style={{
              borderBottom: "3px solid",
              borderImage: "linear-gradient(to right, #009dff, #8a2be2) 1",
            }}
          >
            Re
          </span>
          gistration
        </h1>
        <div className="row g-md-4">
          {/* fullname */}
          <div className="col-md-6 mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              placeholder="Enter your name"
              value={userData.fullname}
              onChange={(e) =>
                setUserData({ ...userData, fullname: e.target.value })
              }
            />
          </div>

          {/* Username */}
          <div className="col-md-6 mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className={`form-control ${
                userData.username &&
                !usernamePattern.test(userData.username) &&
                "is-invalid"
              }`}
              id="username"
              placeholder="Enter your username"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
            <div className="invalid-feedback">
              Username should be between 3 and 20 characters in length.
            </div>
          </div>
        </div>
        <div className="row g-md-4">
          {/* Email */}
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${
                userData.email &&
                !emailPattern.test(userData.email) &&
                "is-invalid"
              }`}
              id="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <div className="invalid-feedback">Invalid Email</div>
          </div>
          {/* phone number */}
          <div className="col-md-6 mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className={`form-control ${
                userData.phoneNumber &&
                !phoneNumberPattern.test(userData.phoneNumber) &&
                "is-invalid"
              }`}
              id="phoneNumber"
              placeholder="Enter your number"
              value={userData.phoneNumber}
              onChange={(e) =>
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
            />
            <div className="invalid-feedback">Phone Number must be valid</div>
          </div>
        </div>
        <div className="row g-md-4">
          {/* password */}
          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${
                userData.password &&
                !passwordPattern.test(userData.password) &&
                "is-invalid"
              }`}
              id="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <div className="invalid-feedback">
              Password must be minimum eight characters long and should contain
              at least one number.
            </div>
          </div>
          {/* confirm Password */}
          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-control ${
                confirmPassword !== userData.password && "is-invalid"
              }`}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setCOnfirmPassword(e.target.value)}
            />
            <div className="invalid-feedback">
              Confirm Password needs to match the password
            </div>
          </div>
        </div>

        {/* gender section */}
        <h2 className="mt-3">Gender</h2>
        <div className="d-flex gap-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="male"
              style={{ backgroundColor: "#80808038" }}
              value="male"
              checked={gender === "male"}
              onChange={handleGenderChange}
            />
            <label className="form-check-label" htmlFor="male">
              Male
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="female"
              style={{ backgroundColor: "#80808038" }}
              value="female"
              checked={gender === "female"}
              onChange={handleGenderChange}
            />
            <label className="form-check-label" htmlFor="female">
              Female
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="preferNotToSay"
              style={{ backgroundColor: "#80808038" }}
              value="preferNotToSay"
              checked={gender === "preferNotToSay"}
              onChange={handleGenderChange}
            />
            <label className="form-check-label" htmlFor="preferNotToSay">
              Prefer not to say
            </label>
          </div>
        </div>
        {error !== "" && <div className="text-danger">{error}</div>}
        <div className="d-grid mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loading}
          >
            {loading ? (
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
