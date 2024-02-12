import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!isLoggedIn || !Object.values(user).length) {
      navigate("login");
    }
  }, []);

  return (
    <View>
      <Text variant="headlineMedium">THis is home screen</Text>
      <Text variant="bodyMedium">{JSON.stringify(user)}</Text>
    </View>
  );
}

export default Home;
