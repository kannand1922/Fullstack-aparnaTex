import React, { useEffect, useState } from "react";
import prodService from "../../api/prod";
import { useNavigate } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CustomNavbar from "../../components/navbar";

import "./cart.scss";
import CustomizedSnackbars from "../../components/sanckbar";
import paymentService from "../../api/payment";

function Cart() {
  const user_id = localStorage.getItem("id");
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await prodService.getCartList(user_id);
      setCartItems(response.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch cart items");
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const temp = { ...product, id: product.product_id, user_id: user_id };
    try {
      await prodService.addCartDetails(temp);
      fetchData();
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const removeFromCart = async (product) => {
    const temp = { ...product, id: product.product_id, user_id: user_id };
    try {
      await prodService.removeCartItem(temp);
      fetchData();
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  const handleRemoveItem = async (prod) => {
    try {
      await prodService.removeCartProduct(prod);
      fetchData();
    } catch (error) {
      console.log(error);
      setError("Failed to remove cart item");
    }
  };

  const handleOrder = async () => {
    try {
      const id = localStorage.getItem("id");
      await prodService.placeOrder(id);
      fetchData();
      setOpen(true);
    } catch (error) {
      console.log(error);
      setError("Failed to place order");
    }
  };

  const handlePayment = async () => {
    const price = calculateTotalCost();
    const id = localStorage.getItem("id");
    try {
      const exist = await prodService.CheckUserDetails(id);
      if (exist) {
        const response = await paymentService.orderPayment(price);
        initPayment(response.data);
      }
    } catch (error) {
      console.log(error);
      nav("/details");
    }
  };

  const initPayment = async (data) => {
    const options = {
      key: "rzp_test_lxRT5NF1Dopxfd",
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: "Aparna Tex",
      description: "E-commerce",
      handler: async (res) => {
        console.log(res);
        try {
          const data = await paymentService.verifyPayment(res);
          if (data) handleOrder();
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "green",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotalCost = () => {
    return cartItems.reduce(
      (total, item) => Number(total) + Number(item.total_price),
      0
    );
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div className="cart">
      <CustomizedSnackbars
        text={"Order Placed Successfully"}
        open={open}
        handleClose={handleClose}
      />
      {loading && <p className="loading">Loading cart items...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div>
          <CustomNavbar />

          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <Card sx={{ maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Price: ₹{item.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Price: ₹{item.total_price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Color: {item.color}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => removeFromCart(item)}
                    >
                      -
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </Button>

                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleRemoveItem(item)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <Typography variant="h6">
              Total Cost: ₹{calculateTotalCost()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              className="order-button"
            >
              Order Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
