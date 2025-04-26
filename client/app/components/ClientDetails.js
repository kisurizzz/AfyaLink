"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { getClientById } from "../../src/utils/api";
import { useRouter } from "next/navigation";

export default function ClientDetails({ clientId }) {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await getClientById(clientId, token);
        setClient(response.data);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError(err.message || "Failed to load client details");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

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

  if (!client) {
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
        <Alert severity="info">Client not found</Alert>
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
              onClick={() => router.push("/dashboard")}
              sx={{ bgcolor: "white" }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Client Profile
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/clients/${clientId}/edit`)}
          >
            Edit Profile
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Client Overview Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {client.first_name} {client.last_name}
                </Typography>
                <Chip
                  label={client.gender}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Tooltip title="Date of Birth">
                    <Chip
                      icon={<CalendarIcon />}
                      label={client.date_of_birth}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information Card */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact Number
                        </Typography>
                        <Typography variant="body1">
                          {client.contact_number || "Not provided"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {client.email || "Not provided"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <LocationIcon
                        sx={{ mr: 1, color: "text.secondary", mt: 0.5 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">
                          {client.address || "Not provided"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Enrolled Programs */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Enrolled Programs
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {client.programs && client.programs.length > 0 ? (
                  <Grid container spacing={2}>
                    {client.programs.map((program) => (
                      <Grid item xs={12} sm={6} md={4} key={program.id}>
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
                              {program.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {program.description}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: "auto",
                              }}
                            >
                              <Chip
                                label={`${program.duration} days`}
                                size="small"
                                color="primary"
                              />
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  router.push(`/programs/${program.id}`)
                                }
                              >
                                View Details
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
                      No programs enrolled
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => router.push("/dashboard?tab=1")}
                    >
                      Browse Programs
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
