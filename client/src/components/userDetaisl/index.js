import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";
import paymentService from "../../api/payment";
import { useNavigate } from "react-router";

const UserDetails = () => {
  const nav = useNavigate();

  // Initialize state for user details
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const temp = localStorage.getItem("id");
    console.log("e");
    try {
      await paymentService.SendUserDetails({ ...userDetails, id: temp });
      setSuccess("Order placed successfully!");
      setError(null);
      nav("/cart");
    } catch (err) {
      setError("Failed to place order. Please try again.");
      setSuccess(null);
    }
    setLoading(false);
  };

  return (
    <Container
      component={Paper}
      elevation={3}
      style={{ padding: "30px", margin: "40px" }}
    >
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={userDetails.name}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={userDetails.email}
            onChange={handleChange}
            margin="normal"
            type="email"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={userDetails.address}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            value={userDetails.phone}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Placing Order..." : "Save Details"}
          </Button>
        </Grid>
      </Grid>
      {success && <Typography color="success">{success}</Typography>}
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default UserDetails;
