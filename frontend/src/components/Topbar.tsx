import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Badge,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import "./Topbar.css";

const Topbar = () => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:600px)");

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <AppBar position="fixed" className="topbar" elevation={1}>
      <Toolbar disableGutters className="topbar-toolbar">
        {isMobile ? (
          showSearch ? (
            <>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="search-field"
                slotProps={{
                  input: {
                    className: "search-input",
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="search-icon" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& fieldset": {
                    border: "none",
                  },
                }}
              />

              <IconButton
                className="search-btn"
                onClick={() => setShowSearch(false)}
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography
                className="logo mobile-logo"
                onClick={() => navigate("/")}
              >
                TripSaver
              </Typography>

              <div className="toolbar-spacer" />

              <IconButton
                className="search-btn"
                onClick={() => setShowSearch(true)}
              >
                <SearchIcon />
              </IconButton>

              <IconButton
                className="notification-btn"
                onClick={() => navigate("/notification")}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
            </>
          )
        ) : (
          <>
            <Typography className="logo" onClick={() => navigate("/")}>
              TripSaver
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              className="search-field"
              slotProps={{
                input: {
                  className: "search-input",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
            />

            <IconButton
              className="notification-btn"
              onClick={() => navigate("/notification")}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
