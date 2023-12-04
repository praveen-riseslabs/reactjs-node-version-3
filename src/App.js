import { Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import AuthUser from "./components/AuthUser"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthUser>
            <DashBoard />
          </AuthUser>
        }
      />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
