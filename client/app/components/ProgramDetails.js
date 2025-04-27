"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  getProgramById,
  unenrollClient,
  deleteProgram,
} from "../../src/utils/api";
import { useRouter } from "next/navigation";

export default function ProgramDetails({ programId }) {
  const router = useRouter();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => {
    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);

  const handleEnrollClick = () => {
    router.push(`/programs/${programId}/enroll`);
  };

  const handleUnenrollClick = (client) => {
    setSelectedClient(client);
    setUnenrollDialogOpen(true);
  };

  const handleUnenrollConfirm = async () => {
    if (!selectedClient) return;

    setUnenrollLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await unenrollClient(selectedClient.id, programId, token);
      setUnenrollDialogOpen(false);
      // Refresh program details
      fetchProgramDetails();
    } catch (err) {
      console.error("Error unenrolling client:", err);
      setError(err.message || "Failed to unenroll client");
    } finally {
      setUnenrollLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await deleteProgram(programId, token);
      router.push("/dashboard/programs");
    } catch (err) {
      console.error("Error deleting program:", err);
      setError(err.message || "Failed to delete program");
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => router.push("/dashboard/programs")}
              sx={{ bgcolor: "white" }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Program Details
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleEnrollClick}
            >
              Enroll Client
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete Program
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Program Overview Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 60, color: "white" }} />
                </Box>
                <Typography variant="h5" gutterBottom>
                  {program.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Tooltip title="Duration">
                    <Chip
                      icon={<CalendarIcon />}
                      label={`${program.duration} days`}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  </Tooltip>
                  <Tooltip title="Enrolled Clients">
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${program.clients?.length || 0} clients`}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Program Details Card */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Program Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <DescriptionIcon
                        sx={{ mr: 1, color: "text.secondary", mt: 0.5 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {program.description || "No description provided"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Enrolled Clients */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Enrolled Clients
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {program.clients && program.clients.length > 0 ? (
                  <Grid container spacing={2}>
                    {program.clients.map((client) => (
                      <Grid item xs={12} sm={6} md={4} key={client.id}>
                        <Card
                          elevation={1}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {client.first_name} {client.last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {client.email ||
                                client.contact_number ||
                                "No contact information"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: "auto",
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  router.push(`/clients/${client.id}`)
                                }
                              >
                                View Client
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<PersonRemoveIcon />}
                                onClick={() => handleUnenrollClick(client)}
                              >
                                Unenroll
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      No clients enrolled in this program
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Unenroll Confirmation Dialog */}
      <Dialog
        open={unenrollDialogOpen}
        onClose={() => setUnenrollDialogOpen(false)}
      >
        <DialogTitle>Confirm Unenrollment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unenroll{" "}
            {selectedClient
              ? `${selectedClient.first_name} ${selectedClient.last_name}`
              : "this client"}{" "}
            from {program.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUnenrollDialogOpen(false)}
            disabled={unenrollLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnenrollConfirm}
            color="error"
            variant="contained"
            disabled={unenrollLoading}
            startIcon={unenrollLoading ? <CircularProgress size={20} /> : null}
          >
            {unenrollLoading ? "Unenrolling..." : "Unenroll"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Program Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Program Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the program "{program.name}"? This
            action cannot be undone.
            {program.clients?.length > 0 && (
              <Typography color="error" sx={{ mt: 1 }}>
                Warning: This program has {program.clients.length} enrolled
                clients. Deleting the program will remove all enrollments.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete Program"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
