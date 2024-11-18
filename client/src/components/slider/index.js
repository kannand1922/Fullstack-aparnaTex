import React from "react";
import Slider from "react-slick";
import "./style.scss";
const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Time between slides in milliseconds
  };

  const images = [
    "https://cdn.ddecor.com/media/wysiwyg/bannerslider/Desktop_Banner/SS24offerbanner_Desktop_New.jpg",
    "https://cdn.ddecor.com/media/wysiwyg/bannerslider/desktop/2_Ethnic-Window.jpg",
    "https://cdn.ddecor.com/media/wysiwyg/bannerslider/desktop/4_RMC.jpg",
    // Add more images as needed
    "https://cdn.ddecor.com/media/wysiwyg/bannerslider/StyleExpertbanner_Desktop_Original.jpg",
  ];

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
