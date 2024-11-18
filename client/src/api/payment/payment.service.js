import axios from "axios";
import { apiPath } from "../../Constants";
class PaymentService {
  async orderPayment(amount) {
    try {
      const response = await axios.post(`${apiPath}/api/payment/orderr`, {
        amount,
      });
      return response.data;
    } catch (error) {
      console.log(error || "Something went wrong");
    }
  }

  async verifyPayment(data) {
    try {
      const response = await axios.post(`${apiPath}/api/payment/verify`, {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error || "Something went wrong");
    }
  }

  async SendUserDetails(data) {
    console.log("dee", data);
    try {
      const response = await axios.post(`${apiPath}/api/payment/details`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error || "Something went wrong");
    }
  }
}

export default PaymentService;
