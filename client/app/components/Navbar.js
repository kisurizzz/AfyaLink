"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { logout } from "../../src/utils/api";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem("token");
      if (token) {
        await logout(token);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear localStorage regardless of API success
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      router.push("/login");
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AfyaLink
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Hi, {user.username}</Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogoutIcon sx={{ mr: 1 }} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
