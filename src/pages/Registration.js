import { useForm } from "react-hook-form";
import { validate } from "../constants/registrationFormValidation";
import { useEffect, useState } from "react";
import { registerUser } from "../store";
import { useThunk } from "../hooks/useThunk";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Registration() {
  const [gender, setGender] = useState("male");
  const [doRegisterUser, loadingUserRegister, errorUserRegister] =
    useThunk(registerUser);
  const navigate = useNavigate();

  const {
    reset,
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
  } = useForm({ mode: "all" });

  //extracting user state from store
  const {user} = useSelector(state=> state.user)

  //handling gender select change
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  //gender object
  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "preferNotToSay", label: "Prefer not to say" },
  ];

  //mapping over gender radio button object
  const genderOptions = genders.map((gen) => {
    return (
      <div className="form-check" key={gen.value}>
        <input
          className="form-check-input"
          type="radio"
          name="gender"
          id={gen.value}
          style={{ backgroundColor: "#80808038" }}
          value={gen.value}
          checked={gender === gen.value}
          onChange={handleGenderChange}
        />
        <label className="form-check-label" htmlFor={gen.value}>
          {gen.label}
        </label>
      </div>
    );
  });

  //handle submitting the registration form
  const onSubmit = async (data, e) => {
    e.preventDefault();

    const userData = {...data, gender}
    await doRegisterUser(userData);

    if(isSubmitSuccessful){
      reset()
    }
  };

  //navigating after user successfully registered 
  useEffect(() => {
    if (Object.keys(user).length === 0) return;

    navigate("/login", { replace: true });
  }, [navigate, user]);
  
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
        onSubmit={handleSubmit(onSubmit)}
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
              className={`form-control ${
                errors.fullName?.message && "is-invalid"
              }`}
              id="fullName"
              {...register("fullname", validate.fullName)}
              placeholder="Enter your name"
            />
            <div className="invalid-feedback">{errors.fullName?.message}</div>
          </div>

          {/* Username */}
          <div className="col-md-6 mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.username?.message && "is-invalid"
              }`}
              id="username"
              {...register("username", validate.username)}
              placeholder="Enter your username"
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
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
                errors.email?.message && "is-invalid"
              }`}
              id="email"
              {...register("email", validate.email)}
              placeholder="Enter your email"
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          {/* phone number */}
          <div className="col-md-6 mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className={`form-control ${
                errors.phoneNumber?.message && "is-invalid"
              }`}
              id="phoneNumber"
              {...register("phoneNumber", validate.phoneNumber)}
              placeholder="Enter your number"
            />
            <div className="invalid-feedback">
              {errors.phoneNumber?.message}
            </div>
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
                errors.password?.message && "is-invalid"
              }`}
              id="password"
              {...register("password", validate.password)}
              placeholder="Enter your password"
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          {/* confirm Password */}
          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-control ${
                errors.confirmPassword?.message && "is-invalid"
              }`}
              id="confirmPassword"
              {...register("confirmPassword", validate.confirmPassword)}
              placeholder="Confirm your password"
            />
            <div className="invalid-feedback">
              {errors.confirmPassword?.message}
            </div>
          </div>
        </div>

        {/* gender section */}
        <h2 className="mt-3">Gender</h2>
        <div className="d-flex gap-4">{genderOptions}</div>

        {/* server side error handling */}
        <div className="text-danger">
          {errorUserRegister && `* ${errorUserRegister}`}
        </div>

        {/* submit button */}
        <div className="d-grid mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #009dff, #8a2be2)",
            }}
            disabled={loadingUserRegister}
          >
            {loadingUserRegister ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
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

export default Registration;
