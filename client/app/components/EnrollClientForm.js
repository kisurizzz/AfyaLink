"use client";

import { useState, useEffect } from "react";
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
  Autocomplete,
} from "@mui/material";
import { createEnrollment } from "../../src/utils/api";
import { getClients } from "../../src/utils/api";
import { useRouter } from "next/navigation";

export default function EnrollClientForm({ program, onCancel }) {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await getClients(token);
        // Filter out clients who are already enrolled in this program
        const enrolledClientIds = program.clients.map((client) => client.id);
        const availableClients = response.data.filter(
          (client) => !enrolledClientIds.includes(client.id)
        );
        setClients(availableClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load available clients");
      }
    };

    fetchClients();
  }, [program]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError("Please select a client to enroll");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await createEnrollment(
        {
          client_id: selectedClient.id,
          program_ids: [program.id],
        },
        token
      );
      setSuccess(true);
      setTimeout(() => {
        router.push(`/programs/${program.id}`); // Navigate back to program details
      }, 1000);
    } catch (err) {
      console.error("Error enrolling client:", err);
      setError(err.message || "Failed to enroll client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Enroll Client in Program
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name}`
              }
              value={selectedClient}
              onChange={(event, newValue) => {
                setSelectedClient(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Client"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Enrolling..." : "Enroll Client"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Client enrolled successfully"
      />
    </Paper>
  );
}
