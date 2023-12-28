import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import { NavLink } from "react-router-dom";
import { Dashboard } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import InventoryIcon from "@mui/icons-material/Inventory";
import TimelineIcon from "@mui/icons-material/Timeline";

function SideBar({ isMobile }) {
  // side bar tabs
  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/",
      icon: <Dashboard sx={{ color: "#403374" }} />,
    },
    {
      label: "Friends",
      to: "/friends",
      icon: <PeopleIcon sx={{ color: "#A46134" }} />,
    },
    {
      label: "Teams",
      to: "/teams",
      icon: <GroupsIcon sx={{ color: "#D93D46" }} />,
    },
    {
      label: "Chats",
      to: "/chats",
      icon: <ChatIcon sx={{ color: "#058CE1" }} />,
    },
    {
      label: "MyAssets",
      to: "/assets",
      icon: <InventoryIcon sx={{ color: "#229F53" }} />,
    },
    {
      label: "Timeline",
      to: "/timeline",
      icon: <TimelineIcon sx={{ color: "#403374" }} />,
    },
  ];

  const linkStyle = ({ isActive }) => {
    if (isActive) {
      return {
        borderLeft: isMobile ? "2px solid #8a2be2" : "4px solid #8a2be2",
        textDecoration: "none",
        color: "white",
      };
    } else {
      return {
        textDecoration: "none",
        color: "gray",
      };
    }
  };

  return sidebarLinks.map((link) => {
    return (
      <NavLink
        key={link.label}
        to={link.to}
        style={linkStyle}
        className="py-2 px-sm-3 px-2 d-flex align-items-center"
        title={link.label}
      >
        {link.icon}
        <label className="px-2 d-none d-md-block">{link.label}</label>
      </NavLink>
    );
  });
}

export default SideBar;
