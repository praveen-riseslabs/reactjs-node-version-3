import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AuthUser({ children }) {
  const { user } = useSelector((state) => state.user);

  if (Object.keys(user).length === 0) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}

export default AuthUser;
