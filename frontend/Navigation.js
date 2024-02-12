import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import Home from "./screens/Home";
import ResetPassword from "./screens/ResetPassword";
import NewPassword from "./screens/NewPassword";
import Otp from "./screens/Otp";

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-password"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="new-password"
          component={NewPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="otp"
          component={Otp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
