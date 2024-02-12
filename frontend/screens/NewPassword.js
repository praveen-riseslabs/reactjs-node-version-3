import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { COLORS, MARGINS, PADDINGS } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { useThunk } from "../hooks/useThunk";
import { resetPassword } from "../store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { goBack, replace } = useNavigation();
  const [
    doResetPassword,
    loadingResetPassword,
    errorLoadingResetPassword,
    resetErrorLoadingResetPassword,
    isResetPasswordRan,
  ] = useThunk(resetPassword);
  const route = useRoute();
  const { userId, id } = route.params;

  const handleResetPassword = () => {
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) return;
    if (!userId || !id) return;
    const data = {
      password,
      confirmPassword,
      userId,
      id,
    };

    doResetPassword(data);
  };

  useEffect(() => {
    if (isResetPasswordRan) {
      replace("login");
    }
  }, [isResetPasswordRan]);

  useEffect(() => {
    if (!errorLoadingResetPassword) return;

    let timer = setTimeout(resetErrorLoadingResetPassword, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingResetPassword]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, "transparent"]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineLarge">
              Enter New Password
            </Text>
          </View>

          <TextInput
            placeholderTextColor="gray"
            activeUnderlineColor={COLORS.primary}
            label="New Password"
            style={S.textField}
            value={password}
            placeholder="Enter new password"
            onChangeText={(e) => setPassword(e)}
          />
          <TextInput
            placeholderTextColor="gray"
            activeUnderlineColor={COLORS.primary}
            label="Confirm New Password"
            style={S.textField}
            value={confirmPassword}
            placeholder="Enter confirm new password"
            onChangeText={(e) => setConfirmPassword(e)}
          />

          {/* errors */}
          <View>
            <HelperText type="error" visible={errorLoadingResetPassword}>
              {errorLoadingResetPassword && errorLoadingResetPassword}
            </HelperText>
          </View>
        </View>

        {/* actions */}
        <View style={S.actionsContainer}>
          <Button
            rippleColor={COLORS.primary}
            mode="outlined"
            style={S.cancelbutton}
            onPress={goBack}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </Button>
          <Button
            loading={loadingResetPassword}
            disabled={errorLoadingResetPassword}
            rippleColor={COLORS.primary}
            mode="contained"
            style={S.button}
            onPress={handleResetPassword}
          >
            <Text style={{ color: "white" }}>Reset Password</Text>
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

export default NewPassword;

const S = StyleSheet.create({
  headerText: {
    color: COLORS.text_primary,
    fontWeight: "bold",
  },
  formContainer: {
    paddingBottom: 20,
    marginHorizontal: MARGINS().sm,
    marginTop: "50%",
    padding: PADDINGS().sm,
    display: "flex",
    gap: 20,
  },
  textField: {
    borderRadius: 5,
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  button: {
    width: "40%",
    backgroundColor: COLORS.primary,
  },
  cancelbutton: {
    width: "40%",
    backgroundColor: COLORS.secondary,
  },
  description: {
    fontSize: 15,
    color: COLORS.text_secondary,
  },
});
