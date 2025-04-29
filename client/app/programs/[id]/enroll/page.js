"use client";

import { useState, useEffect, use } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { getProgramById } from "../../../../src/utils/api";
import { useRouter } from "next/navigation";
import EnrollClientForm from "../../../../app/components/EnrollClientForm";

export default function EnrollClientPage({ params }) {
  const router = useRouter();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const programId = use(params).id;

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await getProgramById(programId, token);
        setProgram(response.data);
      } catch (err) {
        console.error("Error fetching program details:", err);
        setError(err.message || "Failed to load program details");
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!program) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <Alert severity="info">Program not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => router.push(`/programs/${program.id}`)}
            sx={{ bgcolor: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Enroll Client in {program.name}
          </Typography>
        </Box>

        <EnrollClientForm
          program={program}
          onCancel={() => router.push(`/programs/${program.id}`)}
        />
      </Container>
    </Box>
  );
}
