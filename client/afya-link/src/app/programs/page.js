"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Fetch programs
    fetchPrograms();
  }, [router]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/programs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.data) {
        setPrograms(data.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Health Programs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push("/programs/new")}
          >
            Add New Program
          </Button>
        </Box>

        <Grid container spacing={3}>
          {programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {program.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {program.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {program.duration} days
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => router.push(`/programs/${program.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
