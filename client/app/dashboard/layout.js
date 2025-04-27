"use client";

import { Box, Container, Paper, Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      router.push("/dashboard/clients");
    } else {
      router.push("/dashboard/programs");
    }
  };

  const getTabValue = () => {
    if (pathname.includes("/programs")) {
      return 1;
    }
    return 0;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Tabs
            value={getTabValue()}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Clients" />
            <Tab label="Programs" />
          </Tabs>
        </Paper>
        {children}
      </Container>
    </Box>
  );
}
