import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate("/admin-dashboard");
    } catch (error) {
      alert("Error logging in: " + error.response.data.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #ff512f, #dd2476)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          Admin Login
        </Typography>
        <Box component="form" noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              marginTop: 2,
              padding: 1,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(to right, #ff512f, #dd2476)",
              "&:hover": {
                background: "linear-gradient(to left, #ff512f, #dd2476)",
              },
            }}
          >
            Login
          </Button>
        </Box>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ marginTop: 3, color: "gray" }}
        >
          Are you a user?{" "}
          <Button
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "secondary.main",
            }}
          >
            User Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
