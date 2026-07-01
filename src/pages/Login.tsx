import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { usersApi } from "../api/users";
import { UserRole } from "../types";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Avatar from "@mui/material/Avatar";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("class_teacher");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address to reset password.");
      return;
    }
    try {
      setError("");
      setResetMessage("");
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError("Failed to send reset email: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      return handleResetPassword(e);
    }
    try {
      setError("");
      setLoading(true);
      if (isRegister) {
        // Auto-assign owner if it matches, otherwise it's pending
        const isOwnerEmail = email.toLowerCase() === "sekhar.root@gmail.com";

        // Pass to AuthContext to avoid race condition
        localStorage.setItem(
          "pendingRegistration",
          JSON.stringify({
            role: isOwnerEmail ? "owner" : role,
            status: isOwnerEmail ? "active" : "pending",
            displayName: displayName || email.split("@")[0],
          }),
        );

        await createUserWithEmailAndPassword(auth, email, password);
        // Navigation is handled by the useEffect above
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Navigation is handled by the useEffect above
      }
    } catch (err: any) {
      setError(
        `Failed to ${isRegister ? "register" : "log in"}: ` + err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode: "login" | "register" | "forgotPassword") => {
    setError("");
    setResetMessage("");
    if (mode === "login") {
      setIsRegister(false);
      setIsForgotPassword(false);
    } else if (mode === "register") {
      setIsRegister(true);
      setIsForgotPassword(false);
    } else {
      setIsRegister(false);
      setIsForgotPassword(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            {isForgotPassword ? (
              <VpnKeyIcon />
            ) : isRegister ? (
              <PersonAddIcon />
            ) : (
              <LockOutlinedIcon />
            )}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {isForgotPassword
              ? "Reset Password"
              : isRegister
                ? "Create Account"
                : "Teacher Login"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          {resetMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {resetMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {!isForgotPassword && isRegister && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="displayName"
                label="Full Name"
                name="displayName"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isForgotPassword && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {!isForgotPassword && isRegister && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Requested Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  value={role}
                  label="Requested Role"
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <MenuItem value="class_teacher">Class Teacher</MenuItem>
                  <MenuItem value="academic_coordinator">
                    Academic Coordinator
                  </MenuItem>
                  <MenuItem value="principal">Principal</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="owner">Owner</MenuItem>
                </Select>
              </FormControl>
            )}

            {!isForgotPassword && !isRegister && (
              <Box sx={{ mt: 1, textAlign: "right" }}>
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => toggleMode("forgotPassword")}
                >
                  Forgot Password?
                </Link>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {isForgotPassword
                ? "Send Reset Link"
                : isRegister
                  ? "Sign Up"
                  : "Sign In"}
            </Button>

            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {isForgotPassword ? (
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => toggleMode("login")}
                >
                  Back to Sign In
                </Link>
              ) : (
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => toggleMode(isRegister ? "login" : "register")}
                >
                  {isRegister
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Link>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
