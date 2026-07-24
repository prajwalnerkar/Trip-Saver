import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slice/authSlice";
import api from "../api/apiAuth";

import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import "./Register.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);
  const [forgotMobile, setForgotMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await api.post("/login", { mobile, password });
      dispatch(
        loginSuccess({ token: response.data.token, role: response.data.role }),
      );
      navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || "Login failed");
      } else {
        setErrorMsg("Could not connect to the server.");
      }
    }
  };

  const handleRequestOTP = async () => {
    setForgotError("");
    try {
      await api.post("/forgot-password", { mobile: forgotMobile });
      setForgotStep(1);
      setForgotSuccess("OTP sent! Check your terminal.");
    } catch (error: any) {
      setForgotError(error.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    setForgotError("");
    setForgotSuccess("");
    try {
      const response = await api.post("/reset-password", {
        mobile: forgotMobile,
        otp,
        newPassword,
      });

      setForgotSuccess(response.data.message);

      setTimeout(() => {
        setMobile(forgotMobile);
        setPassword("");
        handleCloseModal();
      }, 2000);
    } catch (error: any) {
      setForgotError(error.response?.data?.error || "Failed to reset password");
    }
  };

  const handleCloseModal = () => {
    setOpenForgotModal(false);
    setForgotStep(0);
    setForgotMobile("");
    setOtp("");
    setNewPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <LoginIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Welcome Back
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Sign in to track orders, manage your shop, and keep exploring.
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
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

            <Box sx={{ textAlign: "right" }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setOpenForgotModal(true)}
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "#1976d2",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="submit-btn"
            >
              Sign In
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
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/register")}
            sx={{ fontWeight: 700, textDecoration: "none", color: "#1976d2" }}
          >
            Create one here
          </Link>
        </Typography>
      </div>

      <Dialog
        open={openForgotModal}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: "16px", p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: "center", pb: 1 }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={forgotStep} sx={{ mb: 4, mt: 1 }}>
            <Step>
              <StepLabel>Mobile</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify & Reset</StepLabel>
            </Step>
          </Stepper>

          {forgotError && (
            <Typography
              color="error"
              align="center"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              {forgotError}
            </Typography>
          )}
          {forgotSuccess && (
            <Typography
              color="success.main"
              align="center"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              {forgotSuccess}
            </Typography>
          )}

          {forgotStep === 0 && (
            <TextField
              fullWidth
              label="Enter your Mobile Number"
              variant="outlined"
              type="tel"
              value={forgotMobile}
              onChange={(e) => setForgotMobile(e.target.value)}
              sx={{ mt: 1 }}
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
          )}

          {forgotStep === 1 && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                fullWidth
                label="6-Digit OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
          <Button
            onClick={handleCloseModal}
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Cancel
          </Button>

          {forgotStep === 0 ? (
            <Button
              onClick={handleRequestOTP}
              variant="contained"
              disabled={!forgotMobile}
              sx={{ borderRadius: "8px", px: 3 }}
            >
              Send OTP
            </Button>
          ) : (
            <Button
              onClick={handleResetPassword}
              variant="contained"
              disabled={!otp || !newPassword}
              sx={{ borderRadius: "8px", px: 3 }}
            >
              Reset Password
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
