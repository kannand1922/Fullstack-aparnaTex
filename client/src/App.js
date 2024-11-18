import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import DashBoard from "./pages/Dashboard/DashBoard";
import Cart from "./pages/cart";
import ProductForm from "./components/addProduct";
import Home from "./pages/home";
import ProtectedRoute from "./components/protectedRoute";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetails from "./pages/product";
import Orders from "./pages/order";
import MyOrders from "./pages/myOrders";
import CustomerDetaisl from "./pages/details";
import Wishlist from "./pages/wishlist";
import AnalyticsDashboard from "./pages/analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashBoard />} />}
        />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route
          path="/addProduct"
          element={<ProtectedRoute element={<ProductForm />} />}
        />
        <Route
          path="/product/:id"
          element={<ProtectedRoute element={<ProductDetails />} />}
        />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/orders"
          element={<ProtectedRoute element={<Orders />} />}
        />

        <Route
          path="/myOrders"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
        <Route
          path="/details"
          element={<ProtectedRoute element={<CustomerDetaisl />} />}
        />
        <Route
          path="/wishlist"
          element={<ProtectedRoute element={<Wishlist />} />}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute element={<AnalyticsDashboard />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
