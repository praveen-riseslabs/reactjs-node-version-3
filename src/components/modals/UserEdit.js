import {
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { genders } from "../../constants/gender";
import { useForm } from "react-hook-form";
import { validate } from "../../constants/registrationFormValidation";
import { updateUserInfo } from "../../store";
import { useThunk } from "../../hooks/useThunk";

function UserEdit({ user, userUpdated }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [gender, setGender] = useState(user.gender);
  const [verifyModal, setVerifyModal] = useState(false);
  const [info, setInfo] = useState({});
  const [password, setPassword] = useState("");

  const {
    formState: { errors, isSubmitSuccessful },
    register,
    handleSubmit,
    reset,
  } = useForm({ mode: "all" });

  const [doUpdateUserInfo, loadingUserInfoUpdate, errorUpdatingUserInfo] =
    useThunk(updateUserInfo);

  //handlie opening/closing of modal
  const handleEditModalOpen = () => setOpenEditModal(true);
  const handleEditModalClose = () => setOpenEditModal(false);

  //handlie opening/closing of verify modal
  const handleVerifyModalOpen = () => setVerifyModal(true);
  const handleVerifyModalClose = () => {
    setVerifyModal(false);
    setPassword("")
  };

  //handle gender change
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  //handle password input
  const handlePasswordChange = (e) => setPassword(e.target.value);

  //handle form submission
  const onSubmit = async (data, e) => {
    e.preventDefault();

    if (!Object.keys(errors).length) {
      const userData = { ...data, gender, userId: user.userId };
      setInfo({ ...info, ...userData });
      handleVerifyModalOpen();
    }

    if (isSubmitSuccessful) {
      reset();
    }
  };

  //handle verify and save
  const handleVerifyAndSave = () => {
    const data = { ...info, password };
    doUpdateUserInfo(data);
  };

  //closing and getting user details after sucessfully submitting
  useEffect(() => {
    if (userUpdated) {
      handleEditModalClose();
      handleVerifyModalClose();
      return;
    }
  }, [userUpdated]);

  return (
    <div>
      <IconButton color="primary" onClick={handleEditModalOpen}>
        <BorderColorIcon sx={{ fontSize: "1rem" }} />
      </IconButton>

      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark rounded p-2 text-light"
          style={{ width: "30%" }}
        >
          {/* header */}
          <div className="fs-5 fw-bold border-bottom pb-2">
            Change your profile info
          </div>

          {/* //form contents */}
          <form
            className="mt-2 d-flex flex-column gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* fullname */}
            <div>
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
                defaultValue={user.fullname}
              />
              <div className="invalid-feedback">{errors.fullName?.message}</div>
            </div>

            {/* username */}
            <div>
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
                defaultValue={user.username}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>

            {/* phone Number */}
            <div>
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
                defaultValue={!isNaN(user.phoneNumber) && user.phoneNumber}
              />
              <div className="invalid-feedback">
                {errors.phoneNumber?.message}
              </div>
            </div>

            {/* gender section */}
            <div>
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <Select
                fullWidth
                value={gender}
                onChange={handleGenderChange}
                sx={{ color: "white" }}
              >
                {genders.map((gen) => {
                  return (
                    <MenuItem key={gen.value} value={gen.value}>
                      {gen.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            {/* submit changes */}
            <div className="d-flex gap-3">
              <button
                className="btn btn-danger"
                style={{ width: "100%" }}
                onClick={handleEditModalClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
          {/* //verify password modal */}
          <Modal open={verifyModal} onClose={handleVerifyModalClose}>
            <div
              className="position-absolute top-50 start-50 translate-middle bg-dark rounded p-2 text-light"
              style={{ width: "30%" }}
            >
              <div>Please confirm your password</div>
              <div>
                <input
                  type="password"
                  placeholder="please enter your password"
                  value={password}
                  className="form-control my-3"
                  onChange={handlePasswordChange}
                />
                <div className="text-danger my-2">
                  {errorUpdatingUserInfo && errorUpdatingUserInfo}
                </div>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-danger"
                  style={{ width: "100%" }}
                  onClick={handleVerifyModalClose}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleVerifyAndSave}
                >
                  {loadingUserInfoUpdate ? (
                    <CircularProgress />
                  ) : (
                    "Verify & Save"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </Modal>
    </div>
  );
}

export default UserEdit;
