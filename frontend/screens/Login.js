import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { COLORS, MARGINS, PADDINGS, SPACES } from "../constants";
import CTextInput from "../components/miscs/CTextInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useThunk } from "../hooks/useThunk";
import { loginUser } from "../store";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  const [
    doLoginUser,
    loadingUserLogin,
    errorLoadingUserLogin,
    resetErrorUserLogin,
    isLoginSuccessful,
    resetIsLoginSuccessful,
  ] = useThunk(loginUser);
  const { isLoggedIn } = useSelector((state) => state.user);

  const { navigate } = useNavigation();

  const onLogin = (data) => {
    doLoginUser(data);
    if (isLoginSuccessful) {
      resetIsLoginSuccessful();
      reset();
    }
  };

  useFocusEffect(() => {
    if (!isLoggedIn) return;

    navigate("home");
  });

  useEffect(() => {
    if (!errorLoadingUserLogin) return;

    const timer = setTimeout(resetErrorUserLogin, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingUserLogin]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, "transparent"]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineLarge">
              Login
            </Text>
            {/* <Divider style={S.divider} /> */}
          </View>
          <View style={S.form}>
            <Controller
              control={control}
              name="usernameOrEmail"
              render={({ field: { onChange, value, onBlur } }) => {
                return (
                  <TextInput
                    placeholderTextColor="gray"
                    activeUnderlineColor={COLORS.primary}
                    label="Username or Email"
                    style={S.textField}
                    value={value}
                    placeholder="Enter Username or email"
                    onChangeText={(e) => onChange(e)}
                    onBlur={onBlur}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "Fields must not be empty",
                },
              }}
            />
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "Fields must not be empty",
                },
              }}
            />

            {/* errors */}
            <View>
              <HelperText
                type="error"
                visible={
                  errors.usernameOrEmail ||
                  errors.password ||
                  errorLoadingUserLogin
                }
              >
                {errors.usernameOrEmail?.message ||
                  errors.password?.message ||
                  errorLoadingUserLogin}
              </HelperText>
            </View>
            <View style={S.actionsContainer}>
              <Button
                loading={loadingUserLogin}
                disabled={errorLoadingUserLogin}
                rippleColor={COLORS.primary}
                mode="contained"
                style={S.button}
                onPress={handleSubmit(onLogin)}
              >
                <Text style={{ color: "white" }}>LOGIN</Text>
              </Button>
            </View>
          </View>
        </View>
        <View style={S.navigationContainer}>
          <Text variant="bodyLarge">Don't have an account?</Text>
          <Text
            onPress={() => navigate("register")}
            style={{
              color: COLORS.primary,
              fontWeight: "bold",
              borderBottomColor: COLORS.secondary,
              borderBottomWidth: 1,
            }}
          >
            Register
          </Text>
        </View>
        <View style={S.navigationContainer}>
          <Text variant="bodyLarge">forgot password?</Text>
          <Text
            onPress={() => navigate("reset-password")}
            style={{
              color: COLORS.primary,
              fontWeight: "bold",
              borderBottomColor: COLORS.secondary,
              borderBottomWidth: 1,
            }}
          >
            Reset Password
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default Login;

const S = StyleSheet.create({
  header: { paddingVertical: 10 },
  headerText: {
    paddingHorizontal: PADDINGS().md,
    color: COLORS.text_primary,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
    marginHorizontal: MARGINS().sm,
    marginTop: "50%",
    padding: PADDINGS().sm,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: COLORS.secondary,
  },
  form: {
    gap: SPACES().sm,
    padding: 10,
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
    marginBottom: MARGINS().md,
  },
});
