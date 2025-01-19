import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const ViewUser = () => {
  const location = useLocation();
  const { user } = location.state || {};

  const [notifications, setNotifications] = useState({
    mobile: true,
    email: false,
    whatsapp: true,
  });

  if (!user) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
          padding: "20px",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No user data available
        </Typography>
      </Box>
    );
  }

  const getNotificationIcon = (status) => {
    return status ? (
      <NotificationsIcon sx={{ color: "#4caf50" }} />
    ) : (
      <NotificationsOffIcon sx={{ color: "#f44336" }} />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        padding: "20px",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 800,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent>
          {/* Back Button */}
          <Box display="flex" justifyContent="flex-start" sx={{ mb: 2 }}>
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                color: "#1976d2",
                backgroundColor: "#e3f2fd",
                "&:hover": {
                  backgroundColor: "#bbdefb",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>

          {/* User Profile Picture */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Avatar
              src={user.profilePhoto || ""}
              alt={user.name || "User"}
              sx={{
                width: 100,
                height: 100,
                marginRight: "16px",
                backgroundColor: "#e0e0e0",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  marginBottom: "8px",
                }}
              >
                {user.name || "User Name"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: "20px" }} />

          {/* User Info */}
          <Grid container spacing={2}>
            {[
              { label: "Name", value: user.name },
              { label: "Company", value: user.company },
              { label: "Project", value: user.project },
              { label: "Mobile", value: user.mobile, notificationKey: "mobile" },
              { label: "Email", value: user.email, notificationKey: "email" },
              { label: "WhatsApp", value: user.whatsapp, notificationKey: "whatsapp" },
              { label: "Registration Date", value: user.registrationDate }, // Added registration date
            ].map((item, index) => (
              <React.Fragment key={index}>
                <Grid item xs={4}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    {item.label}:
                  </Typography>
                </Grid>
                <Grid item xs={8} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      fontSize: "1.1rem",
                      color: item.label === "Email" ? "#1565c0" : "inherit",
                    }}
                  >
                    {item.value || "N/A"}
                  </Typography>
                  {item.notificationKey && (
                    <Tooltip
                      title={
                        notifications[item.notificationKey]
                          ? "Notification Enabled"
                          : "Notification Disabled"
                      }
                      arrow
                    >
                      <Box sx={{ marginLeft: "8px" }}>
                        {getNotificationIcon(notifications[item.notificationKey])}
                      </Box>
                    </Tooltip>
                  )}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewUser;
