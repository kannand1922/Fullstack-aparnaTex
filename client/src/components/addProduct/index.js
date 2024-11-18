import React, { useState, useRef } from "react";
import adminService from "../../api/admin";
import "./style.scss"; // Import the CSS file
import CustomizedSnackbars from "../sanckbar";
import CustomNavbar from "../navbar";

const ProductForm = () => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Data = await convertToBase64(file);
      setProductData({
        ...productData,
        image: base64Data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("image", productData.image);
    try {
      const response = await adminService.PostProductDetails(formData);
      console.log(response);
      if (response) {
        setProductData({});
        setOpen(true);
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <CustomizedSnackbars
        text={"Product Added Successfully"}
        open={open}
        handleClose={handleClose}
      />
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={productData.description || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price || "0"}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
            ref={fileInputRef}
          />
        </div>
        <button type="submit" className="submit-btn">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
