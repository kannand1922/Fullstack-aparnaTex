import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./style.scss";
import prodService from "../../api/prod";
import Carousel from "../../components/slider";
import { useNavigate } from "react-router";
import CustomNavbar from "../../components/navbar";
import MapComponent from "../../components/map";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 11.1676,
  lng: 77.6042,
};

function Home() {
  const nav = useNavigate();
  const [teamData, setTeamData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await prodService.getProductsList();
      setTeamData(response.products); // Adjust according to your response structure
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <CustomNavbar />

      <div className="parent">
        <section className="hero-section">
          <div className="hero-content">
            <div>Welcome to Aparna Tex</div>
            <p>Your one-stop shop for premium textiles.</p>
            <button className="shop-now-btn" onClick={() => nav("/dashboard")}>
              Shop Now
            </button>
          </div>
        </section>
        <div className="carousel1">
          <Carousel />
        </div>
      </div>

      <section className="map-section">
        <div className="map-card">
          <h2>Our Location</h2>
          <div className="maps">
            <MapComponent />
          </div>
        </div>
      </section>

      <section className="about-us">
        <div className="about-content">
          <div className="about-description">
            <h2>About Us</h2>
            <p>
              At Aparna Tex, we pride ourselves on offering a wide range of
              premium textiles. Our products are sourced from the finest
              materials to ensure quality and comfort. Our team is dedicated to
              providing exceptional service and ensuring that every customer has
              a great experience. Explore our collection and discover the
              perfect textiles for your home.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <h3>Contact Information</h3>
            <p>
              <strong>A.S. Sathishkumar</strong>
            </p>
            <p>Proprietor</p>
            <p>Phone: 99657 03922, 94897 03922</p>
            <p>
              <strong>APARNA TEX</strong>
            </p>
            <p>All types of Bedsheets & Hospital Bedsheets</p>
            <p>
              <strong>GSTIN:</strong> 33DXWPS8666E1ZK
            </p>
          </div>
          <div className="contact-item">
            <h3>Bank Details</h3>
            <p>
              <strong>KARUR VYSYA BANK</strong>
            </p>
            <p>Branch: CHENNIMALAI</p>
            <p>362, Madheswara Nagar, Melappalayam</p>
            <p>Acc. No.: 1641115000001479</p>
            <p>IFS Code: KVBL0001641</p>
            <p>CHENNIMALAI - 638 051, Erode Dt., T.N.</p>
            <p>Email: aparnatexchml@gmail.com</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Aparna Tex. All Rights Reserved.</p>
        <div className="social-links">
          <a href="#facebook">Facebook</a>
          <a href="#instagram">Instagram</a>
          <a href="#twitter">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
