import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const ViewUser = () => {
  const location = useLocation();
  const { user } = location.state || {};

  // State for notification status for mobile, email, and whatsapp
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

  // Get the appropriate icon based on notification status
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
          maxWidth: 600,
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

          {/* User Details Header */}
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              marginBottom: "16px",
            }}
          >
            User Details
          </Typography>
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
            ].map((item, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.label}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
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
