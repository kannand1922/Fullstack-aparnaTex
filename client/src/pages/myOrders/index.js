import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download"; // Material-UI icon for download
import jsPDF from "jspdf"; // For generating PDF
import prodService from "../../api/prod";
import CustomNavbar from "../../components/navbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      const temp = localStorage.getItem("id");
      try {
        const response = await prodService.getMyOrderList(temp);
        console.log(response.orders);
        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to generate and download invoice as PDF
  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();

    // Add title with font size and alignment
    doc.setFontSize(24);
    doc.text("Invoice", 105, 20, { align: "center" });

    // Add a line below the title
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Customer and order details section
    doc.setFontSize(12);
    doc.text("Customer Information", 20, 35);
    doc.setFontSize(10);
    doc.text(`Name: ${order.name}`, 20, 45);
    doc.text(`Email: ${order.email}`, 20, 55);
    doc.text(`Phone: ${order.phone}`, 20, 65);
    doc.text(`Address: ${order.address}`, 20, 75);

    // Order details section
    doc.setFontSize(12);
    doc.text("Order Details", 20, 90);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 20, 100);
    doc.text(`Order Date: ${order.order_date}`, 20, 110);

    // Add another line below customer info
    doc.line(20, 120, 190, 120);

    // Product details with proper formatting
    doc.setFontSize(12);
    doc.text("Product Information", 20, 130);
    doc.setFontSize(10);
    doc.text(`Product Name: ${order.product_name}`, 20, 140);
    doc.text(`Quantity: ${order.quantity}`, 20, 150);
    doc.text(`Total Price: ₹${order.total_price}`, 20, 160);
    doc.text(`Status: ${order.status}`, 20, 170);

    // Add another line before company contact details
    doc.line(20, 180, 190, 180);

    // Contact Information Section
    doc.setFontSize(12);
    doc.text("Contact Information", 20, 190);
    doc.setFontSize(10);
    doc.text("A.S. Sathishkumar", 20, 200);
    doc.text("Proprietor", 20, 210);
    doc.text("Phone: 99657 03922, 94897 03922", 20, 220);
    doc.text("APARNA TEX", 20, 230);
    doc.text("All types of Bedsheets & Hospital Bedsheets", 20, 240);
    doc.text("GSTIN: 33DXWPS8666E1ZK", 20, 250);

    doc.setFontSize(12);
    doc.text("Bank Details", 20, 270);
    doc.setFontSize(10);
    doc.text("KARUR VYSYA BANK", 20, 280);
    doc.text("Branch: CHENNIMALAI", 20, 290);
    doc.text("362, Madheswara Nagar, Melappalayam", 20, 300);
    doc.text("Acc. No.: 1641115000001479", 20, 310);
    doc.text("IFS Code: KVBL0001641", 20, 320);
    doc.text("CHENNIMALAI - 638 051, Erode Dt., T.N.", 20, 330);
    doc.text("Email: aparnatexchml@gmail.com", 20, 340);

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, 350, { align: "center" });

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="product12">
      <div>
        <CustomNavbar />
      </div>

      <div>
        <Grid container spacing={3} className="orders-container">
          {orders &&
            orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card className="order-card">
                  <CardContent>
                    <Typography variant="h6">Order ID: {order.id}</Typography>
                    <Typography variant="body1">
                      Product: {order.product_name}
                    </Typography>
                    <Typography variant="body2">
                      Quantity: {order.quantity}
                    </Typography>
                    <Typography variant="body2">
                      Total Price: ₹{order.total_price}
                    </Typography>
                    <Typography variant="body2">
                      Status: {order.status}
                    </Typography>
                    <Typography variant="body2">
                      Order Date: {order.order_date}
                    </Typography>
                    <Typography variant="body2">Name: {order.name}</Typography>
                    <Typography variant="body2">
                      Email: {order.email}
                    </Typography>
                    <Typography variant="body2">
                      Phone Number: {order.phone}
                    </Typography>
                    <Typography variant="body2">
                      Address: {order.address}
                    </Typography>

                    {/* Add download button */}
                    <IconButton
                      aria-label="download"
                      onClick={() => handleDownloadInvoice(order)}
                      sx={{ textAlign: "end" }}
                    >
                      <DownloadIcon />
                      <div style={{ fontSize: "14px", marginLeft: "10px" }}>
                        Invoice Download
                      </div>
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
}
