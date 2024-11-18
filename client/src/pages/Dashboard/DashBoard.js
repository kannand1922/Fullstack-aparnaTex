import { useEffect, useState } from "react";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import prodService from "../../api/prod";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FilterSection from "../../components/filter";
import CustomNavbar from "../../components/navbar";

function DashBoard() {
  const nav = useNavigate();
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [wishlist, setWishlist] = useState([]); // Wishlist state
  const [userRole, setUserRole] = useState(""); // State for user role

  const fetchData = async () => {
    try {
      const response = await prodService.getProductsList();
      setTeamData(response.products);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      await prodService.addCartDetails(product);
      fetchData();
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await prodService.deleteItem(id);
      if (response) fetchData();
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  // Toggle wishlist functionality
  const toggleWishlist = async (productId) => {
    try {
      const id = localStorage.getItem("id");
      const response = await prodService.AddWishList({
        product_id: productId,
        id: id,
      });
      if (response) fetchData();
    } catch (err) {
      console.log(err);
    }

    // setWishlist((prevWishlist) =>
    //   prevWishlist.includes(productId)
    //     ? prevWishlist.filter((id) => id !== productId)
    //     : [...prevWishlist, productId]
    // );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortOrder("");
  };

  useEffect(() => {
    fetchData();
    const role = localStorage.getItem("role");
    setUserRole(role); // Set the user role from localStorage
  }, []);

  const sortedProducts = teamData
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.price - b.price;
      } else if (sortOrder === "highToLow") {
        return b.price - a.price;
      }
      return 0;
    });

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <CustomNavbar />
      <div className="content-container">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          handleSortChange={handleSortChange}
          clearFilters={clearFilters}
        />
        <div className="product-list">
          {loading && <p className="loading">Loading products...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div>
              <h2>Products List</h2>
              <div className="card-container">
                {sortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    sx={{ maxWidth: 375, marginBottom: 2 }}
                  >
                    <CardMedia
                      sx={{ height: 300 }}
                      image={product.image}
                      title={product.name}
                      onClick={() => nav(`/product/${product.id}`)} // Navigate to ProductDetails page
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
                        onClick={() => toggleWishlist(product.id)} // Toggle wishlist state
                        color={
                          wishlist.includes(product.id) ? "primary" : "default"
                        }
                      >
                        {product.status > 0 ? (
                          <FavoriteIcon color="primary" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      {userRole === "Admin" && (
                        <IconButton
                          color="error"
                          onClick={() => removeItem(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
