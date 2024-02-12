import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { COLORS, MARGINS, PADDINGS } from "../constants";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useThunk } from "../hooks/useThunk";
import { sendPasswordResetOtp, verifyPasswordResetOtp } from "../store";
import { useSelector } from "react-redux";

function Otp() {
  const [otp, setOtp] = useState("");
  const [isResendReqDisabled, setIsResendReqDisabled] = useState(true);
  const { goBack, replace } = useNavigation();
  const [time, setTime] = useState({ minutes: 10, seconds: 0 });
  const { resetPass } = useSelector((state) => state.user);
  const [timeExpired, setTimeExpired] = useState(false);

  const route = useRoute();
  const { email } = route.params;

  const [
    doVerifyOtp,
    loadingVerifyOtp,
    errorLoadingVerifyOtp,
    resetErrorLoadingVerifyOtp,
    isVerifyOtpRan,
  ] = useThunk(verifyPasswordResetOtp);

  const [
    doSendOtp,
    loadingSentOtp,
    errorLoadingSentOtp,
    resetErrorLoadingSentOtp,
  ] = useThunk(sendPasswordResetOtp);

  const handleVerifyOtp = () => {
    if (!resetPass.user_id || !resetPass.id) return;
    if (!email) return;
    const data = { otp, userId: resetPass.user_id, id: resetPass.id };
    doVerifyOtp(data);
  };

  useEffect(() => {
    if (isVerifyOtpRan) {
      replace("new-password", {
        userId: resetPass.user_id,
        id: resetPass.id,
      });
    }
  }, [isVerifyOtpRan]);

  useEffect(() => {
    if (!errorLoadingVerifyOtp) return;

    let timer = setTimeout(resetErrorLoadingVerifyOtp, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingVerifyOtp]);

  useEffect(() => {
    if (!errorLoadingSentOtp) return;

    let timer = setTimeout(resetErrorLoadingSentOtp, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorLoadingSentOtp]);

  useEffect(() => {
    if (time.minutes === 9 || time.seconds === 0) {
      setIsResendReqDisabled(false);
    }
  }, [time.minutes]);
  // console.log(time.minutes, " ",time.seconds);

  useEffect(() => {
    let timeRemaining = 10 * 60 * 1000;

    function updateTimer() {
      const min = Math.floor(timeRemaining / (60 * 1000));
      const sec = Math.floor((timeRemaining % (60 * 1000)) / 1000);

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        setTimeExpired(true);
      } else {
        timeRemaining -= 10 * 1000;
      }

      setTime({ ...time, minutes: min, seconds: sec });
    }

    const timerInterval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, "transparent"]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineLarge">
              Enter OTP
            </Text>
            {/* <Divider style={S.divider} /> */}
            <Text style={S.description} variant="headlineLarge">
              an OPT has been sent on email address :{email}
              <Text style={{ color: "white" }}>{otp}</Text>
            </Text>
          </View>
          <TextInput
            placeholderTextColor="gray"
            activeUnderlineColor={COLORS.primary}
            style={S.textField}
            value={otp}
            onChangeText={(e) => setOtp(e)}
            maxLength={6}
            keyboardType="number-pad"
          />
        </View>
        {/* errors */}
        <HelperText
          type="error"
          visible={errorLoadingVerifyOtp}
          style={S.error}
        >
          {errorLoadingVerifyOtp && errorLoadingVerifyOtp}
        </HelperText>

        <Text style={S.text}>
          otp expires in :{" "}
          <Text style={{ color: "blue" }}>
            {time.minutes}:{time.seconds}
          </Text>
        </Text>

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
            loading={loadingVerifyOtp}
            disabled={errorLoadingVerifyOtp || timeExpired}
            rippleColor={COLORS.primary}
            mode="contained"
            style={S.button}
            onPress={handleVerifyOtp}
          >
            <Text style={{ color: "white" }}>Verify OTP</Text>
          </Button>
        </View>
        <View style={S.resetOtpContainer}>
          <HelperText type="error" visible={true}>
            {errorLoadingSentOtp && errorLoadingSentOtp}
          </HelperText>
          <Button
            loading={loadingSentOtp}
            disabled={errorLoadingSentOtp || isResendReqDisabled}
            rippleColor={COLORS.secondary}
            mode="contained-tonal"
            style={S.cancelbutton}
            onPress={() => {
              if (isResendReqDisabled) return;
              doSendOtp(email);
              if (!errorLoadingSentOtp) {
                setTime({ ...time, minutes: 10, seconds: 0 });
                return
              }
            }}
          >
            <Text style={{ color: "orange" }}>Re-send OTP</Text>
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

export default Otp;

const S = StyleSheet.create({
  headerText: {
    color: COLORS.text_primary,
    fontWeight: "bold",
  },
  text: {
    marginHorizontal: MARGINS().sm,
    padding: PADDINGS().sm,
    textAlign: "center",
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
    borderWidth: 5,
    borderColor: COLORS.primary,
    fontSize: 30,
    padding: PADDINGS().xsm,
    textAlign: "center",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  resetOtpContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  error: {
    textAlign: "center",
  },
});
