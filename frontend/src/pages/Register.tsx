import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slice/authSlice";
import api from "../api/apiAuth";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import "./Register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState<"shopper" | "owner">("shopper");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      role,
      name,
      mobile,
      password,
      ...(role === "owner" && { shopName, shopAddress }),
    };

    try {
      const response = await api.post("/register", payload);

      console.log("Success:", response.data.message);

      dispatch(
        loginSuccess({
          token: response.data.token,
          role: role,
        }),
      );

      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || "Registration failed");
      } else {
        setErrorMsg("Could not connect to the server. Is Flask running?");
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <PersonAddIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Join TripSaver
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Select your account type to get started.
          </Typography>
        </Box>

        <div className="custom-toggle-container">
          <button
            type="button"
            onClick={() => {
              setRole("shopper");
              setErrorMsg("");
            }}
            className={`toggle-btn ${role === "shopper" ? "active" : ""}`}
          >
            <ShoppingBagIcon fontSize="small" /> Shopper
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("owner");
              setErrorMsg("");
            }}
            className={`toggle-btn ${role === "owner" ? "active" : ""}`}
          >
            <StorefrontIcon fontSize="small" /> Shop Owner
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-stack">
            {errorMsg && (
              <Typography
                sx={{
                  color: "error.main",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {errorMsg}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              required
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {role === "owner" && (
              <>
                <TextField
                  fullWidth
                  label="Shop Name"
                  variant="outlined"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <StorefrontIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Shop Address"
                  variant="outlined"
                  required
                  multiline
                  rows={2}
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 1.5 }}
                        >
                          <LocationOnIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="submit-btn"
            >
              {role === "shopper" ? "Create Shopper Account" : "Open My Shop"}
            </Button>
          </div>
        </form>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 4,
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
              color: "#1976d2",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in here
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default Register;
