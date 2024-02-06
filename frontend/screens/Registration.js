import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import { COLORS, MARGINS, PADDINGS, SPACES } from "../constants";
import { useEffect, useState } from "react";
import CTextInput from "../components/miscs/CTextInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { registerUser } from "../store";
import { useSelector } from "react-redux";
import { useThunk } from "../hooks/useThunk";
import { Controller, useForm } from "react-hook-form";

function Registration() {
  const [gender, setGender] = useState("preferNotToSay");

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    control,
  } = useForm({ mode: "onBlur" });

  const { navigate } = useNavigation();
  const [
    doRegisterUser,
    loadingUserRegister,
    errorLoadingUserRegister,
    resetErrorUserRegister,
    isRegisterSuccessful,
    resetIsRegisterSuccessful,
  ] = useThunk(registerUser);
  const { isLoggedIn } = useSelector((state) => state.user);

  const onRegister = (data) => {
    const userData = { ...data, gender };
    doRegisterUser(userData);

    if (isRegisterSuccessful) {
      resetIsRegisterSuccessful();
      reset();
    }
  };

  useFocusEffect(() => {
    if (!isLoggedIn) return;

    navigate("home");
  });

  useEffect(() => {
    if (!errorLoadingUserRegister) return;

    const timer = setTimeout(resetErrorUserRegister, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingUserRegister]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, "transparent"]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineSmall">
              Registration
            </Text>
            {/* <Divider style={S.divider} /> */}
          </View>
          <View style={S.form}>
            {/* fullname */}
            <View>
              <Controller
                control={control}
                name="fullname"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <TextInput
                      placeholderTextColor="gray"
                      activeUnderlineColor={COLORS.primary}
                      style={S.textField}
                      label="FullName"
                      value={value}
                      placeholder="Enter Fullname"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "fullname is required",
                  },
                }}
              />
              <HelperText
                type="error"
                visible={errors.fullname}
                style={S.helperText}
              >
                {errors.fullname?.message}
              </HelperText>
            </View>
            {/* username */}
            <View>
              <Controller
                control={control}
                name="username"
                render={({ field: { onBlur, onChange, value } }) => {
                  return (
                    <TextInput
                      placeholderTextColor="gray"
                      activeUnderlineColor={COLORS.primary}
                      label="Username"
                      style={S.textField}
                      value={value}
                      placeholder="Enter Username"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "Username is required",
                  },
                  pattern: {
                    value: /^.{8,}$/,
                    message: "Username must be at least 8 characters long",
                  },
                }}
              />
              <HelperText
                type="error"
                visible={errors.username}
                style={S.helperText}
              >
                {errors.username?.message}
              </HelperText>
            </View>
            {/* email */}
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => {
                  return (
                    <TextInput
                      placeholderTextColor="gray"
                      activeUnderlineColor={COLORS.primary}
                      label="Email"
                      value={value}
                      keyboardType="email-address"
                      placeholder="Enter Email"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "email is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email is not valid",
                  },
                }}
              />
              <HelperText
                type="error"
                visible={errors.email}
                style={S.helperText}
              >
                {errors.email?.message}
              </HelperText>
            </View>
            {/* phoneNumber */}
            <View>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onBlur, onChange, value } }) => {
                  return (
                    <TextInput
                      placeholderTextColor="gray"
                      activeUnderlineColor={COLORS.primary}
                      label="Phone Number"
                      value={value}
                      keyboardType="number-pad"
                      placeholder="Enter Phone Number"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "Phone Number is required",
                  },
                }}
              />
              <HelperText
                type="error"
                visible={errors.phoneNumber}
                style={S.helperText}
              >
                {errors.phoneNumber?.message}
              </HelperText>
            </View>
            {/* password */}
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => {
                  return (
                    <CTextInput
                      placeholderTextColor="gray"
                      label="Password"
                      secureTextEntry
                      showVisibilityBtn
                      value={value}
                      placeholder="Enter Password"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "password is required",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character and should be 8 characters long",
                  },
                }}
              />
              <HelperText
                type="error"
                visible={errors.password}
                style={S.helperText}
              >
                {errors.password?.message}
              </HelperText>
            </View>
            {/* confirm password */}
            <View>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onBlur, onChange, value } }) => {
                  return (
                    <CTextInput
                      placeholderTextColor="gray"
                      label="Confirm Password"
                      secureTextEntry
                      showVisibilityBtn
                      value={value}
                      placeholder="Enter Confirm Password"
                      onChangeText={(e) => onChange(e)}
                      onBlur={onBlur}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "confirm password is required",
                  },
                  validate: (v) =>
                    v === getValues("password") ||
                    "Confirm password should match with password",
                }}
              />
              <HelperText
                type="error"
                visible={errors.confirmPassword}
                style={S.helperText}
              >
                {errors.confirmPassword?.message}
              </HelperText>
            </View>
            {/* gender */}
            <View>
              <View>
                <Text variant="titleMedium" style={{ color: "white" }}>
                  Gender :
                </Text>
              </View>
              <RadioButton.Group
                onValueChange={(newValue) => setGender(newValue)}
                value={gender}
              >
                <View style={S.radioBtnContainer}>
                  <View style={S.radioBtn}>
                    <RadioButton value="male" color={COLORS.primary} />
                    <Text>Male</Text>
                  </View>
                  <View style={S.radioBtn}>
                    <RadioButton value="female" color={COLORS.primary} />
                    <Text>Female</Text>
                  </View>
                  <View style={S.radioBtn}>
                    <RadioButton
                      value="preferNotToSay"
                      color={COLORS.primary}
                    />
                    <Text>Prefer Not To Say</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {/* register button */}
            <View style={S.actionsContainer}>
              <HelperText type="error" visible={true} style={S.helperText}>
                {errorLoadingUserRegister && errorLoadingUserRegister}
              </HelperText>
              <Button
                loading={loadingUserRegister}
                disabled={errorLoadingUserRegister}
                rippleColor={COLORS.primaryHalf}
                mode="contained"
                style={S.button}
                onPress={handleSubmit(onRegister)}
              >
                <Text style={{ color: "white" }}>REGISTER</Text>
              </Button>
            </View>
          </View>
        </View>
        <View style={S.navigationContainer}>
          <Text variant="bodyLarge">Already have an account?</Text>
          <Text
            onPress={() => navigate("login")}
            style={{
              color: COLORS.primary,
              fontWeight: "bold",
              borderBottomColor: COLORS.secondary,
              borderBottomWidth: 1,
            }}
          >
            Login
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

export default Registration;

const S = StyleSheet.create({
  header: { paddingVertical: 10 },
  headerText: { textAlign: "center", color: "white", fontWeight: "bold" },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
    margin: MARGINS().sm,
    padding: PADDINGS().sm,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: COLORS.secondary,
  },
  form: {
    gap: SPACES().sm,
    paddingHorizontal: 10,
  },
  textField: {
    borderRadius: 5,
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  button: {
    width: "80%",
    backgroundColor: COLORS.primary,
  },
  radioBtnContainer: { display: "flex", flexDirection: "row" },
  radioBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACES().xsm,
    marginTop: MARGINS().md,
  },
  helperText: {
    paddingTop: 0,
  },
});
