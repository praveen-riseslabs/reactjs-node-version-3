import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { COLORS, MARGINS, PADDINGS } from "../constants";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useThunk } from "../hooks/useThunk";
import { sendPasswordResetOtp } from "../store";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [
    doSendOtp,
    loadingSentOtp,
    errorLoadingSentOtp,
    resetErrorLoadingSentOtp,
    isSentOtpRan,
  ] = useThunk(sendPasswordResetOtp);

  const { navigate, goBack } = useNavigation();

  const handleSendOtp = () => {
    if (!email) return;
    doSendOtp(email);
  };

  useEffect(() => {
    if (isSentOtpRan) {
      navigate("otp", { email });
    }
  }, [isSentOtpRan]);

  useEffect(() => {
    if (!errorLoadingSentOtp) return;

    let timer = setTimeout(resetErrorLoadingSentOtp, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingSentOtp]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, "transparent"]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineLarge">
              Reset Password
            </Text>
            {/* <Divider style={S.divider} /> */}
            <Text style={S.description} variant="headlineLarge">
              an OPT will be sent to the entered email address
            </Text>
          </View>
          <TextInput
            placeholderTextColor="gray"
            activeUnderlineColor={COLORS.primary}
            label="Email"
            style={S.textField}
            value={email}
            placeholder="Enter email"
            onChangeText={(e) => setEmail(e)}
          />
        </View>
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
            loading={loadingSentOtp}
            disabled={errorLoadingSentOtp}
            rippleColor={COLORS.primary}
            mode="contained"
            style={S.button}
            onPress={handleSendOtp}
          >
            <Text style={{ color: "white" }}>Send OTP</Text>
          </Button>
        </View>

        {/* errors */}
        <View>
          <HelperText type="error" visible={errorLoadingSentOtp}>
            {errorLoadingSentOtp && errorLoadingSentOtp}
          </HelperText>
        </View>
      </LinearGradient>
    </View>
  );
}

export default ResetPassword;

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
