import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import { COLORS, MARGINS, PADDINGS, SPACES } from "../constants";
import { useState } from "react";
import CTextInput from "../components/miscs/CTextInput";
import { useNavigation } from "@react-navigation/native";

function Registration() {
  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    gender: "preferNotToSay",
    confirmPassword: "",
  });

  const { navigate } = useNavigation();
  // navigate()
  console.log(userData);

  const handleChange = (newValue) => {
    setUserData({ ...userData, gender: newValue });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, COLORS.primary, COLORS.secondary]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineSmall">
              Registration
            </Text>
            <Divider style={S.divider} bold />
          </View>
          <View style={S.form}>
            <TextInput
              placeholderTextColor="gray"
              style={S.textField}
              label="FullName"
              value={userData.fullname}
              placeholder="Enter Fullname"
              onChangeText={(e) => setUserData({ ...userData, fullname: e })}
            />
            <TextInput
              placeholderTextColor="gray"
              label="Username"
              style={S.textField}
              value={userData.username}
              placeholder="Enter Username"
              onChangeText={(e) => setUserData({ ...userData, username: e })}
            />
            <TextInput
              placeholderTextColor="gray"
              label="Email"
              value={userData.email}
              keyboardType="email-address"
              placeholder="Enter Email"
              onChangeText={(e) => setUserData({ ...userData, email: e })}
            />
            <TextInput
              placeholderTextColor="gray"
              label="Phone Number"
              value={userData.phone}
              keyboardType="number-pad"
              placeholder="Enter Phone Number"
              onChangeText={(e) => setUserData({ ...userData, phone: e })}
            />
            <CTextInput
              placeholderTextColor="gray"
              label="Password"
              secureTextEntry
              showVisibilityBtn
              value={userData.password}
              placeholder="Enter Password"
              onChangeText={(e) => setUserData({ ...userData, password: e })}
            />
            <CTextInput
              placeholderTextColor="gray"
              label="Confirm Password"
              secureTextEntry
              showVisibilityBtn
              value={userData.confirmPassword}
              placeholder="Enter Confirm Password"
              onChangeText={(e) =>
                setUserData({ ...userData, confirmPassword: e })
              }
            />
            <View>
              <View>
                <Text variant="titleMedium" style={{ color: "white" }}>
                  Gender :
                </Text>
              </View>
              <RadioButton.Group
                onValueChange={handleChange}
                value={userData.gender}
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
            <View style={S.actionsContainer}>
              <Button mode="contained" style={S.button} rippleColor={"red"}>
                <Text style={{ color: "white" }}>REGISTER</Text>
              </Button>
            </View>
            <View style={S.navigationContainer}>
              <Text variant="bodyLarge" style={{ color: "#bababa" }}>
                Already have an account?
              </Text>
              <Text
                onPress={() => navigate("login")}
                style={{ color: COLORS.primary, fontWeight: "bold" }}
              >
                Login
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
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
  },
});
