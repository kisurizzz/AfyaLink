"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // TODO: Fetch user data using the token
    // For now, just show a welcome message
    setUser({ username: "Doctor" });
  }, [router]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.username}!
        </Typography>
        <Typography variant="body1">
          This is your dashboard. You can manage your clients and programs here.
        </Typography>
      </Box>
    </Container>
  );
}
