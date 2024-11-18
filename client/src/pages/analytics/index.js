// chart.tsx
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import adminService from "../../api/admin";
import CustomNavbar from "../../components/navbar";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [orderData, setOrderData] = useState({});
  const [productData, setProductData] = useState({});

  useEffect(() => {
    const fetchOrderAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        const data = response?.data || [];
        const dates = data.map((order) => {
          // Check if order_date exists
          if (order?.order_date) {
            // Convert order_date to a Date object and extract only the date part
            return new Date(order.order_date).toISOString().split("T")[0];
          } else {
            return "No Date";
          }
        });

        const totalOrders = data.map((order) => order?.total_orders || 0);
        const totalRevenue = data.map((order) => order?.total_revenue || 0);

        setOrderData({
          labels: dates,
          datasets: [
            {
              label: "Total Orders",
              data: totalOrders,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              fill: true,
            },
            {
              label: "Total Revenue (₹)",
              data: totalRevenue,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching order analytics:", error);
      }
    };

    const fetchProductAnalytics = async () => {
      try {
        const response = await adminService.getAnalyticsProduct();
        const data = response?.data || [];
        const productNames = data.map(
          (product) => product?.product_name || "Unknown Product"
        );
        const totalQuantities = data.map(
          (product) => product?.total_quantity || 0
        );

        setProductData({
          labels: productNames,
          datasets: [
            {
              label: "Total Quantity Sold",
              data: totalQuantities,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching product analytics:", error);
      }
    };

    fetchOrderAnalytics();
    fetchProductAnalytics();
  }, []);

  return (
    <div>
      <CustomNavbar />
      <div>
        <h2>Orders and Revenue Over Time</h2>
        {orderData.labels && orderData.labels.length > 0 ? (
          <Line
            data={orderData}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Date" } },
                y: { title: { display: true, text: "Count / Revenue" } },
              },
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* Products Sold */}
      <div>
        <h2>Products Sold</h2>
        {productData.labels && productData.labels.length > 0 ? (
          <Bar
            data={productData}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Products" } },
                y: { title: { display: true, text: "Quantity Sold" } },
              },
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
