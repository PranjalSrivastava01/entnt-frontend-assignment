import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
        `https://entnt-backend-3.onrender.com/api/login`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate("/user-dashboard");
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
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
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
          Login
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
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(to left, #6a11cb, #2575fc)",
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
          Are you an admin?{" "}
          <Button
            onClick={() => navigate("/admin-login")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "secondary.main",
            }}
          >
            Admin Login
          </Button>
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ marginTop: 3, color: "gray" }}
        >
          Don’t have an account?{" "}
          <Button
            onClick={() => navigate("/register")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "secondary.main",
            }}
          >
            Register
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
