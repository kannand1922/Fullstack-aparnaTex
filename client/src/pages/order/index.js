import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import "./style.scss";
import prodService from "../../api/prod";
import CustomNavbar from "../../components/navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      const temp = localStorage.getItem("id");
      try {
        const response = await prodService.getOrderList();
        console.log(response.orders);
        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="product12">
      <CustomNavbar />
      <Grid container spacing={3} className="orders-container">
        {orders &&
          orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card className="order-card">
                <CardContent>
                  <Typography variant="h6">Order ID: {order.id}</Typography>
                  <Typography variant="body2">
                    Customer Name: {order.name}
                  </Typography>
                  <Typography variant="body2">
                    Address: {order.address}
                  </Typography>
                  <Typography variant="body2">
                    Email: {order.email}
                  </Typography>
                  <Typography variant="body2">
                    Phone Number: {order.phone}
                  </Typography>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
