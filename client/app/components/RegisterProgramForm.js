"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { createProgram } from "../../src/utils/api";
import { useRouter } from "next/navigation";

export default function RegisterProgramForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await createProgram(formData, token);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/programs");
      }, 1000);
    } catch (err) {
      console.error("Error registering program:", err);
      setError(err.message || "Failed to register program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2, bgcolor: "white" }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Register New Program
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Program Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (days)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => router.push("/dashboard/programs")}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ minWidth: 120, bgcolor: "primary.main" }}
              >
                {loading ? "Registering..." : "Register Program"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Program registered successfully"
      />
    </Paper>
  );
}
