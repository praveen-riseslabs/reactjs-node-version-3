import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import { NavLink } from "react-router-dom";
import { Dashboard } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';
import InventoryIcon from '@mui/icons-material/Inventory';

function SideBar() {
  // side bar tabs
  const sidebarLinks = [
    { label: "Dashboard", to: "/", icon: <Dashboard /> },
    { label: "Friends", to: "/friends", icon: <PeopleIcon /> },
    { label: "Teams", to: "/teams", icon: <GroupsIcon /> },
    { label: "Chats", to: "/chats", icon: <ChatIcon /> },
    { label: "MyAssets", to: "/assets", icon: <InventoryIcon /> },
  ];

  const linkStyle = ({ isActive }) => {
    if (isActive) {
      return {
        borderLeft: "4px solid #8a2be2",
        textDecoration: "none",
        color:"white"
    };
} else {
    return {
        textDecoration: "none",
        color:"gray"
      };
    }
  };

  return sidebarLinks.map((link) => {
    return (
      <NavLink key={link.label} to={link.to} style={linkStyle} className="py-2 px-3 d-flex align-items-center">
        {link.icon}
        <label className="px-2">{link.label}</label>
      </NavLink>
    );
  });
}

export default SideBar;
