"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TabPanel from "../components/common/TabPanel";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { login, signup } from "../utils/api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const data = await login(username, password);

      if (data.error) {
        throw new Error(data.error);
      }

      // Store the token
      localStorage.setItem("token", data.data.token);
      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("signup-username");
    const password = formData.get("signup-password");
    const email = formData.get("email");

    try {
      const data = await signup(username, password, email);

      if (data.error) {
        throw new Error(data.error);
      }

      // Switch to login tab
      setTabValue(0);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          AfyaLink
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SignupForm onSubmit={handleSignup} loading={loading} />
        </TabPanel>
      </StyledPaper>
    </Container>
  );
}
