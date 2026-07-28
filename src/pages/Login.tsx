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
  Tabs,
  Tab,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Avatar from "@mui/material/Avatar";
import { DarkVeil, SplitText } from "../components/reactbits";

export default function Login() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0); // 0: School Staff, 1: Admin Access, 2: Owner Portal
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
  const { currentUser, userProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (currentUser && userProfile && !authLoading) {
      navigate("/");
    }
  }, [currentUser, userProfile, authLoading, navigate]);

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
        const isOwnerTab = activeTab === 2;
        const isAdminTab = activeTab === 1;
        const isOwnerEmail = email.toLowerCase() === "sekhar.root@gmail.com";
        
        let assignedRole: UserRole = role;
        if (isOwnerTab || isOwnerEmail) {
          assignedRole = "owner";
        } else if (isAdminTab && (role !== "admin" && role !== "school_admin")) {
          assignedRole = "school_admin";
        }

        // Pass to AuthContext to avoid race condition
        localStorage.setItem(
          "pendingRegistration",
          JSON.stringify({
            role: assignedRole,
            status: (isOwnerTab || isOwnerEmail) ? "active" : "pending",
            displayName: displayName || email.split("@")[0],
            schoolId: isOwnerTab ? "default_school" : (schoolId || "default_school"),
            schoolName: isOwnerTab ? "System / All Schools" : (schoolName || "Default School"),
          }),
        );

        await createUserWithEmailAndPassword(auth, email, password);
        // Navigation is handled by the useEffect above
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user profile to validate their role & school assignment
        const profile = await usersApi.getProfile(user.uid);
        if (profile) {
          const isOwner = profile.role === "owner";
          const isAdmin = profile.role === "admin" || profile.role === "school_admin";
          const isOwnerOrAdmin = isOwner || isAdmin;

          if (activeTab === 2) {
            // Owner Portal Login Tab
            if (!isOwner && profile.role !== "admin") {
              await signOut(auth);
              setError("This account does not have Owner / Global Admin privileges. Please use the Staff or Admin tab.");
              setLoading(false);
              return;
            }
            localStorage.setItem("adminSelectedSchoolId", profile.schoolId || "default_school");
            localStorage.setItem("adminSelectedSchoolName", profile.schoolName || "System / All Schools");
          } else if (activeTab === 1) {
            // Admin Access Login Tab
            if (!isOwnerOrAdmin) {
              await signOut(auth);
              setError("This account does not have Admin privileges. Please use the Staff Login tab.");
              setLoading(false);
              return;
            }
            localStorage.setItem("adminSelectedSchoolId", schoolId || profile.schoolId || "default_school");
            localStorage.setItem("adminSelectedSchoolName", schoolName || profile.schoolName || "Default School");
          } else {
            // School Staff Login Tab
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
              // Owners/Admins logging in under staff tab can context switch
              localStorage.setItem("adminSelectedSchoolId", schoolId || "default_school");
              localStorage.setItem("adminSelectedSchoolName", schoolName || "Default School");
            }
          }
        }
        localStorage.setItem("loginSelectedSchoolId", activeTab === 2 ? "default_school" : (schoolId || "default_school"));
        localStorage.setItem("loginSelectedSchoolName", activeTab === 2 ? "System / All Schools" : (schoolName || "Default School"));
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
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        overflow: "hidden",
      }}
    >
      <DarkVeil speed={0.9} />
      <Container component="main" maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: "24px",
              backdropFilter: "blur(16px)",
              backgroundColor: theme.palette.mode === "dark" 
                ? "rgba(15, 20, 32, 0.82)" 
                : "rgba(255, 255, 255, 0.88)",
              border: "1px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.8)",
              boxShadow: theme.palette.mode === "dark" 
                ? "0 20px 50px 0 rgba(0, 0, 0, 0.6)" 
                : "0 20px 50px 0 rgba(31, 38, 135, 0.10)",
            }}
          >
          <Tabs
            value={activeTab}
            onChange={(_, val) => {
              setActiveTab(val);
              setError("");
              setIsRegister(false);
              setIsForgotPassword(false);
              if (val === 2) {
                setRole("owner");
              } else if (val === 1) {
                setRole("school_admin");
              } else {
                setRole("class_teacher");
              }
            }}
            variant="fullWidth"
            sx={{
              width: "100%",
              mb: 3,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "none",
                minWidth: 0,
                px: 1,
              },
            }}
          >
            <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="Staff" />
            <Tab icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" label="Admin" />
            <Tab icon={<SupervisorAccountIcon fontSize="small" />} iconPosition="start" label="Owner" />
          </Tabs>

          <Avatar 
            sx={{ 
              m: 1, 
              background: activeTab === 2
                ? "linear-gradient(135deg, #FF9800 0%, #F44336 100%)" 
                : activeTab === 1
                  ? "linear-gradient(135deg, #673AB7 0%, #3F51B5 100%)"
                  : "linear-gradient(135deg, #2196F3 0%, #E91E63 100%)", 
              width: 54, 
              height: 54,
              boxShadow: activeTab === 2 
                ? "0 4px 15px rgba(244, 67, 54, 0.3)"
                : activeTab === 1
                  ? "0 4px 15px rgba(103, 58, 183, 0.3)"
                  : "0 4px 15px rgba(233, 30, 99, 0.3)"
            }}
          >
            {isForgotPassword ? (
              <VpnKeyIcon />
            ) : isRegister ? (
              <PersonAddIcon />
            ) : activeTab === 2 ? (
              <SupervisorAccountIcon sx={{ fontSize: 32, color: "#ffffff" }} />
            ) : activeTab === 1 ? (
              <AdminPanelSettingsIcon sx={{ fontSize: 32, color: "#ffffff" }} />
            ) : (
              <SchoolIcon sx={{ fontSize: 32, color: "#ffffff" }} />
            )}
          </Avatar>

          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ mb: 3, fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}
          >
            <SplitText
              key={
                isForgotPassword
                  ? "Reset Password"
                  : isRegister
                    ? (activeTab === 2 ? "Owner Registration" : activeTab === 1 ? "Admin Registration" : "Create Account")
                    : (activeTab === 2 ? "Owner Portal" : activeTab === 1 ? "Admin Access" : "Staff Login")
              }
              text={
                isForgotPassword
                  ? "Reset Password"
                  : isRegister
                    ? (activeTab === 2 ? "Owner Registration" : activeTab === 1 ? "Admin Registration" : "Create Account")
                    : (activeTab === 2 ? "Owner Portal" : activeTab === 1 ? "Admin Access" : "Staff Login")
              }
              delay={0.04}
              duration={2}
              textAlign="center"
            />
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
                  value={activeTab === 2 ? "owner" : role}
                  label="Requested Role"
                  disabled={activeTab === 2}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  {activeTab === 2 && (
                    <MenuItem value="owner">System Owner / Global Admin</MenuItem>
                  )}
                  {activeTab === 1 && (
                    <MenuItem value="school_admin">School Admin</MenuItem>
                  )}
                  {activeTab === 0 && (
                    <MenuItem value="class_teacher">Class Teacher</MenuItem>
                  )}
                  {activeTab === 0 && (
                    <MenuItem value="academic_coordinator">Academic Coordinator</MenuItem>
                  )}
                  {activeTab === 0 && (
                    <MenuItem value="principal">Principal</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}

            {!isForgotPassword && (activeTab === 0 || activeTab === 1) && (
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
                  <MenuItem value="default_school">Default School / All Schools</MenuItem>
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
              ) : activeTab === 2 ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  Owner accounts are pre-provisioned by system administrators.
                </Typography>
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
  </Box>
  );
}
