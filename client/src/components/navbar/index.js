import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ProductModal from "../model";

import "./style.scss"; // Import your custom CSS

export default function CustomNavbar() {
  const nav = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  // Function to open the modal
  const handleOpenModal = () => setOpenModal(true);

  // Function to close the modal
  const handleCloseModal = () => setOpenModal(false);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    nav("/");
  };

  // Get user role from localStorage
  const userRole = localStorage.getItem("role");

  return (
    <>
      <ProductModal open={openModal} onClose={handleCloseModal} />
      <AppBar position="static" className="custom-navbar">
        <Toolbar className="toolbar">
          <Typography
            variant="h6"
            className="title"
            onClick={() => nav("/home")}
          >
            APARNA TEX
          </Typography>
          <Box className="nav-links">
            {userRole === "Admin" && (
              <Button
                color="inherit"
                onClick={() => {
                  handleOpenModal();
                }}
              >
                Add Product
              </Button>
            )}
            <Button color="inherit" onClick={() => nav("/dashboard")}>
              Products List
            </Button>

            {userRole !== "Admin" && (
              <Button color="inherit" onClick={() => nav("/wishlist")}>
                Wish List
              </Button>
            )}

            {userRole == "Admin" && (
              <Button color="inherit" onClick={() => nav("/analytics")}>
                Analytics
              </Button>
            )}
            {userRole === "Admin" && (
              <Button color="inherit" onClick={() => nav("/orders")}>
                Orders
              </Button>
            )}

            {userRole !== "Admin" && (
              <Button color="inherit" onClick={() => nav("/cart")}>
                Cart
              </Button>
            )}

            {userRole !== "Admin" && (
              <Button color="inherit" onClick={() => nav("/details")}>
                User Details
              </Button>
            )}

            {userRole !== "Admin" && (
              <Button color="inherit" onClick={() => nav("/myOrders")}>
                My Orders
              </Button>
            )}

            <Button color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
