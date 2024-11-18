import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import prodService from "../../api/prod"; // API service to fetch wishlist
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button"; // Import Button from MUI
import CustomNavbar from "../../components/navbar";
import "./style.scss";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchWishlist = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await prodService.getWishList(id);
      setWishlistItems(response.products); // Assuming response.products contains the list of products with wishlist status
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setError("Failed to fetch wishlist");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      const id = localStorage.getItem("id");
      const response = await prodService.AddWishList({
        product_id: productId,
        id: id,
      });
      if (response) fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await prodService.checkout(localStorage.getItem("id"));
      if (response) navigate("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wishlist-container">
      <CustomNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "79%",
        }}
      >
        <h2>Your Wishlist</h2>
      </div>
      {loading && <p>Loading wishlist...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="wishlist-items">
          {wishlistItems.length === 0 ? (
            <p>No items in your wishlist.</p>
          ) : (
            wishlistItems.map((product) => (
              <Card key={product.id} className="wishlist-card">
                <CardMedia
                  className="card-media"
                  image={product.image}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Price: ₹{product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="error"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
