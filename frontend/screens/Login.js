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

function Login() {
  const [userData, setUserData] = useState({
    usernameOrPassword: "",
    password: "",
  });

  const { navigate } = useNavigation();
  
  console.log(userData);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[COLORS.secondary, COLORS.primary, COLORS.secondary]}
      >
        <View style={S.formContainer}>
          <View style={S.header}>
            <Text style={S.headerText} variant="headlineSmall">
              Login
            </Text>
            <Divider style={S.divider} bold />
          </View>
          <View style={S.form}>
            <TextInput
              placeholderTextColor="gray"
              label="Username or Email"
              style={S.textField}
              value={userData.usernameOrPassword}
              placeholder="Enter Username or email"
              onChangeText={(e) =>
                setUserData({ ...userData, usernameOrPassword: e })
              }
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
            <View style={S.actionsContainer}>
              <Button mode="contained" style={S.button} rippleColor={"red"}>
                <Text style={{ color: "white" }}>LOGIN</Text>
              </Button>
            </View>
            <View style={S.navigationContainer}>
              <Text variant="bodyLarge" style={{ color: "#bababa" }}>
                Don't have an account?
              </Text>
              <Text
                onPress={() => navigate("register")}
                style={{ color: COLORS.primary, fontWeight: "bold" }}
              >
                Register
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default Login;

const S = StyleSheet.create({
  header: { paddingVertical: 10 },
  headerText: { textAlign: "center", color: "white", fontWeight: "bold" },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
    marginHorizontal: MARGINS().sm,
    marginTop: "50%",
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
