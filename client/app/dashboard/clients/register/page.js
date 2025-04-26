"use client";

import { Box, Container, Typography, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import RegisterClientForm from "../../../../app/components/RegisterClientForm";

export default function RegisterClientPage() {
  const router = useRouter();

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
            onClick={() => router.push("/dashboard/clients")}
            sx={{ bgcolor: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Register New Client
          </Typography>
        </Box>

        <RegisterClientForm />
      </Container>
    </Box>
  );
}
