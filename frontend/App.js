import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <Navigation />
    </Provider>
  );
}

export default App;
