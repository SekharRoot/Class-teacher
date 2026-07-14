import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { usersApi } from "../api/users";
import { UserRole, School } from "../types";
import { schoolsApi } from "../api/schools";
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
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import Avatar from "@mui/material/Avatar";

export default function Login() {
  const theme = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("class_teacher");
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
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

  useEffect(() => {
    schoolsApi.getAll().then((list) => {
      // Filter out inactive schools for login and registration
      const activeSchools = list.filter((s) => s.isActive !== false);
      setSchools(activeSchools);
      if (activeSchools.length > 0) {
        setSchoolId(activeSchools[0].id);
        setSchoolName(activeSchools[0].name);
      } else {
        setSchoolId("default_school");
        setSchoolName("Default School");
      }
    });
  }, []);

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
            schoolId: schoolId || "default_school",
            schoolName: schoolName || "Default School",
          }),
        );

        await createUserWithEmailAndPassword(auth, email, password);
        // Navigation is handled by the useEffect above
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user profile to validate their school assignment
        const profile = await usersApi.getProfile(user.uid);
        if (profile) {
          const isOwnerOrAdmin = profile.role === "owner" || profile.role === "admin";
          
          if (!isOwnerOrAdmin) {
            // Check if account schoolId matches the chosen login schoolId
            if (schoolId && profile.schoolId && profile.schoolId !== schoolId) {
              await signOut(auth);
              setError(`Your account belongs to "${profile.schoolName || "another school"}" and cannot log into "${schoolName}". Please select the correct school.`);
              setLoading(false);
              return;
            }

            // Check if their school is inactive
            const allSchs = await schoolsApi.getAll();
            const chosenSch = allSchs.find((s) => s.id === (profile.schoolId || schoolId));
            if (chosenSch && chosenSch.isActive === false) {
              await signOut(auth);
              setError(`Your school "${chosenSch.name}" is currently inactive. Please contact your administrator.`);
              setLoading(false);
              return;
            }
          } else {
            // Owners/Admins can view any school's context by logging in with it!
            localStorage.setItem("adminSelectedSchoolId", schoolId || "default_school");
            localStorage.setItem("adminSelectedSchoolName", schoolName || "Default School");
          }
        }
        localStorage.setItem("loginSelectedSchoolId", schoolId || "default_school");
        localStorage.setItem("loginSelectedSchoolName", schoolName || "Default School");
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
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: "24px",
            border: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            boxShadow: theme.palette.mode === "dark" 
              ? "0 12px 40px 0 rgba(0, 0, 0, 0.5)" 
              : "0 12px 40px 0 rgba(31, 38, 135, 0.08)",
          }}
        >
          <Avatar 
            sx={{ 
              m: 1.5, 
              background: "linear-gradient(135deg, #2196F3 0%, #E91E63 100%)", 
              width: 54, 
              height: 54,
              boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)"
            }}
          >
            {isForgotPassword ? (
              <VpnKeyIcon />
            ) : isRegister ? (
              <PersonAddIcon />
            ) : (
              <SchoolIcon sx={{ fontSize: 32, color: "#ffffff" }} />
            )}
          </Avatar>
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ mb: 3, fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {isForgotPassword
              ? "Reset Password"
              : isRegister
                ? "Create Account"
                : "SMS Login"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}
          {resetMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2, borderRadius: "12px" }}>
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="username email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            {!isForgotPassword && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            {!isForgotPassword && isRegister && (
              <FormControl fullWidth margin="normal" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
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
                  <MenuItem value="school_admin">School Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="owner">Owner</MenuItem>
                </Select>
              </FormControl>
            )}

            {!isForgotPassword && (
              <FormControl fullWidth margin="normal" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                <InputLabel id="school-select-label">Select School</InputLabel>
                <Select
                  labelId="school-select-label"
                  id="school"
                  value={schoolId || "default_school"}
                  label="Select School"
                  onChange={(e) => {
                    const selId = e.target.value;
                    setSchoolId(selId);
                    if (selId === "default_school") {
                      setSchoolName("Default School");
                    } else {
                      const found = schools.find((s) => s.id === selId);
                      if (found) {
                        setSchoolName(found.name);
                      }
                    }
                  }}
                >
                  <MenuItem value="default_school">Default School</MenuItem>
                  {schoolId && schoolId !== "default_school" && !schools.some((s) => s.id === schoolId) && (
                    <MenuItem key={schoolId} value={schoolId} style={{ display: "none" }}>
                      {schoolName || "Loading..."}
                    </MenuItem>
                  )}
                  {schools.map((sch) => (
                    <MenuItem key={sch.id} value={sch.id}>
                      {sch.name}
                    </MenuItem>
                  ))}
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
                  sx={{ textDecoration: "none", fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                borderRadius: "12px", 
                textTransform: "none", 
                fontWeight: "bold",
                fontSize: "1rem",
              }}
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
                gap: 1.5,
              }}
            >
              {isForgotPassword ? (
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => toggleMode("login")}
                  sx={{ textDecoration: "none", fontWeight: 600 }}
                >
                  Back to Sign In
                </Link>
              ) : (
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => toggleMode(isRegister ? "login" : "register")}
                  sx={{ textDecoration: "none", fontWeight: 600 }}
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
