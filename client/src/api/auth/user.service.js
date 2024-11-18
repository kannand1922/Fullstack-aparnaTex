import { apiPath } from "../../Constants";
import axios from 'axios'
class UserService {
  async getSignupDetails(val) {
    const response = await axios.post(`${apiPath}/api/auth/register`, val);
    return response.data;
  }
  async getLoginDetails(val) {
    const response = await axios.post(`${apiPath}/api/auth/login`, val);
    return response.data;
  }
}

export default UserService;
