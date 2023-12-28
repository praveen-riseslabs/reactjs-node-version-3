import { Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import AuthUser from "./components/AuthUser";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Friends from "./components/shared/Friends";
import Teams from "./components/shared/Teams";
import Profile from "./components/Profile";
import Home from "./pages/Home";
import Chats from "./components/shared/Chats";
import Assets from "./components/shared/Assets";
import Timeline from "./components/shared/Timeline";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthUser>
            <Home />
          </AuthUser>
        }
      >
        <Route index element={<DashBoard />} />
        <Route path="friends" element={<Friends />} />
        <Route path="teams" element={<Teams />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chats" element={<Chats />} />
        <Route path="assets" element={<Assets />} />
        <Route path="timeline" element={<Timeline />} />
      </Route>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />

      <Route path="/verify/:token" element={<VerifyEmail />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:userId" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
