import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import prodService from "../../api/prod";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import CustomNavbar from "../../components/navbar";
import "./style.scss";
import CustomizedSnackbars from "../../components/sanckbar";
import SizeChartModal from "../../components/model/sizeModal";

const colors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
];

const sizes = ["Twin", "Full", "King", "Queen"];

function ProductDetails() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [notification, setNotification] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const user_id = localStorage.getItem("id");

  const fetchProduct = async () => {
    try {
      const response = await prodService.getProductById(id);
      setProduct(response.product);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to fetch product");
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      if (!selectedColor || !selectedSize) {
        alert("Please select both color and size");
        return;
      }
      await prodService.addCartDetails({
        ...product,
        color: selectedColor,
        size: selectedSize,
        user_id: user_id,
      });
      setNotification("Product added to cart successfully!");
      setOpen(true);
      fetchProduct();
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setNotification("Failed to add product to cart.");
      setOpen(true);
    }
  };

  const removeFromCart = async () => {
    try {
      await prodService.removeCartItem({
        ...product,
        color: selectedColor,
        size: selectedSize,
        user_id: user_id,
      });
      setNotification("Product removed from cart successfully!");
      setOpen(true);
      fetchProduct();
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
      setNotification("Failed to remove product from cart.");
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="product-details-container">
      <CustomNavbar />
      <CustomizedSnackbars
        text={notification}
        open={open}
        handleClose={handleClose}
      />
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />
      <Box className="product-details-box">
        {product && (
          <Card className="product-card">
            <CardMedia
              component="img"
              alt={product.name}
              height="300"
              image={product.image}
              title={product.name}
              className="product-media"
            />
            <Box className="product-info">
              <CardContent className="product-content">
                <Typography gutterBottom variant="h4" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" className="product-price">
                  Price: ₹{product.price}
                </Typography>
                <Typography variant="h6" className="product-count">
                  Count: {product.count}
                </Typography>
                <Typography variant="h6" className="product-cart-count">
                  Items in Cart: {product.cart_count}
                </Typography>
                <Box className="product-options">
                  <Box className="product-color">
                    <Typography variant="h6" className="option-label">
                      Color:
                    </Typography>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="color-select"
                    >
                      <option value="" disabled>
                        Select color
                      </option>
                      {colors.map((color) => (
                        <option key={color.hex} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    {selectedColor && (
                      <Box
                        className="color-preview"
                        sx={{ backgroundColor: selectedColor }}
                      />
                    )}
                  </Box>
                  <Box className="product-size">
                    <Typography variant="h6" className="option-label">
                      Size:
                    </Typography>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="size-select"
                    >
                      <option value="" disabled>
                        Select size
                      </option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </Box>
                </Box>

                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setSizeChartOpen(true)}
                  sx={{ mt: 2 }}
                >
                  View Size Chart
                </Button>
              </CardContent>
              <CardActions className="product-actions">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={removeFromCart}
                  disabled={!selectedColor || !selectedSize}
                >
                  Remove from Cart
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addToCart}
                  disabled={!selectedColor || !selectedSize}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Box>
          </Card>
        )}
      </Box>
    </div>
  );
}

export default ProductDetails;
