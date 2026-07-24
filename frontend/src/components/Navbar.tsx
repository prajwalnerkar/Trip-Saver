import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  isShopOwner?: boolean;
}

const baseNavItems = [
  {
    label: "Home",
    value: "/",
    icon: <HomeOutlinedIcon />,
  },
  {
    label: "Store",
    value: "/store",
    icon: <StorefrontOutlinedIcon />,
  },
  {
    label: "Reserve",
    value: "/reserve",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    label: "Profile",
    value: "/profile",
    icon: <PersonOutlineOutlinedIcon />,
  },
];

function Navbar({ isShopOwner }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = isShopOwner
    ? [
        ...baseNavItems,
        {
          label: "Add",
          value: "/add",
          icon: <AddCircleOutlinedIcon />,
        },
      ]
    : baseNavItems;

  const currentPath = navItems.some((item) => item.value === location.pathname)
    ? location.pathname
    : "";

  return (
    <Paper elevation={3} className="bottom-navbar">
      <BottomNavigation
        value={currentPath}
        onChange={(_, newValue) => navigate(newValue)}
        className="bottom-navigation"
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default Navbar;
