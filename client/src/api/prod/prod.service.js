import { apiPath } from "../../Constants";
import axios from "axios";
class ProdService {
  async getProductsList() {
    const response = await axios.get(`${apiPath}/api/prod/prodList`);
    return response.data;
  }

  async getProductById(id) {
    const response = await axios.get(
      `${apiPath}/api/prod/productDetails/${id}`
    );
    return response.data;
  }
  async addCartDetails(val) {
    const response = await axios.post(`${apiPath}/api/prod/add`, val);
    return response.data;
  }

  async removeCartItem(val) {
    const response = await axios.post(`${apiPath}/api/prod/remove`, val);
    return response.data;
  }
  async removeCartProduct(val) {
    const response = await axios.delete(
      `${apiPath}/api/prod/removeCartProduct`,
      { data: val }
    );
    return response.data;
  }
  async getCartList(id) {
    const response = await axios.get(`${apiPath}/api/prod/cartList/${id}`);
    return response.data;
  }
  async deleteItem(val) {
    const response = await axios.delete(`${apiPath}/api/prod/delete`, {
      data: { id: val },
    });
    return response.data;
  }

  async placeOrder(id) {
    console.log(id, "-->id");
    const response = await axios.post(`${apiPath}/api/prod/order`, { id: id });
    return response.data;
  }

  async getOrderList() {
    const response = await axios.get(`${apiPath}/api/prod/orderDetails`);
    return response.data;
  }

  async getMyOrderList(id) {
    const response = await axios.get(`${apiPath}/api/prod/myOrders/${id}`);
    return response.data;
  }

  async CheckUserDetails(id) {
    const response = await axios.get(`${apiPath}/api/prod/order/check/${id}`);
    return response.data;
  }
  async AddWishList(data) {
    const response = await axios.post(`${apiPath}/api/prod/add/wishlist`, data);
    return response.data;
  }

  async getWishList(id) {
    const response = await axios.get(`${apiPath}/api/prod/get/wishlist/${id}`);
    return response.data;
  }

  async checkout(id) {
    const response = await axios.get(`${apiPath}/api/prod/checkout/${id}`);
    return response.data;
  }
}

export default ProdService;
