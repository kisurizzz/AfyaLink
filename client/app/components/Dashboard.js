"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { getClients, getPrograms } from "../../src/utils/api";

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch both clients and programs
        const [clientsResponse, programsResponse] = await Promise.all([
          getClients(token),
          getPrograms(token),
        ]);

        // Update state with the data
        setClients(clientsResponse.data || []);
        setPrograms(programsResponse.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            AfyaLink Dashboard
          </Typography>
        </Box>

        <Paper sx={{ width: "100%", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Clients" />
            <Tab label="Programs" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        {client.first_name} {client.last_name}
                      </TableCell>
                      <TableCell>{client.date_of_birth}</TableCell>
                      <TableCell>{client.gender}</TableCell>
                      <TableCell>
                        {client.contact_number || client.email || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                          View
                        </Button>
                        <Button variant="outlined" size="small" color="primary">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Duration (days)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.length > 0 ? (
                  programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>{program.name}</TableCell>
                      <TableCell>{program.description}</TableCell>
                      <TableCell>{program.duration}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                          View
                        </Button>
                        <Button variant="outlined" size="small" color="primary">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No programs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
