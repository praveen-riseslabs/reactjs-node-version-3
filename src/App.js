import { Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import AuthUser from "./components/AuthUser";
import VerifyEmail from "./pages/VerifyEmail";

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

      <Route path="/verify/:token" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;
