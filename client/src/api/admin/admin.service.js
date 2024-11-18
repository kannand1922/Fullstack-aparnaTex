import { apiPath } from "../../Constants";
import axios from "axios";
class AdminService {
  async PostProductDetails(val) {
    const response = await axios.post(`${apiPath}/api/admin/product`, val);
    return response.data;
  }
  async getLoginDetails(val) {
    const response = await axios.post(`${apiPath}/api/auth/login`, val);
    return response.data;
  }
  async getAnalytics() {
    const response = await axios.get(`${apiPath}/api/prod/analytics`);
    return response.data;
  }
  async getAnalyticsProduct() {
    const response = await axios.get(`${apiPath}/api/prod/analytics/product`);
    return response.data;
  }
}

export default AdminService;
