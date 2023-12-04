export const validate = {
  fullName: {
    required: "Fullname is required",
  },
  username: {
    required: "Username is required",
    pattern: {
      // [a-zA-Z0-9_]: Matches any uppercase letter, lowercase letter, digit, or underscore.
      // {3,20}: Specifies that the username should be between 3 and 20 characters in length.
      value: /^[a-zA-Z0-9_]{3,20}$/,
      message: "Username should be between 3 and 20 characters in length.",
    },
  },
  email: {
    //[a-zA-Z0-9._%+-]+: Matches one or more word characters (alphanumeric), dots, underscores, percent signs, plus signs, or hyphens for the local part of the email address.
    // @gmail\.com: Matches the literal characters "@gmail.com".
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      message: "Email should be a valid email address",
    },
  },
  phoneNumber: {
    required: "Phone number is required",
    pattern: {
      //[789]: Matches either '7', '8', or '9', which are the starting digits of Indian phone numbers.
      // \d{9}: Matches exactly 9 digits after the starting digit.
      value: /^[789]\d{9}$/,
      message: "Please enter a valid phone number",
    },
  },
  password: {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message:
        "Password must be minimum eight characters long and should contain at least one number.",
    },
  },
  confirmPassword: {
    required: "Confirm Password needs to match the password",
  },
};
