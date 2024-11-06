import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion"; // Import necessary components from Framer Motion
import customerImg from "../../assets/HabituraCropLogo.png";
import TestimonialCard from '../../Components/cards/TestimonialCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Heading from "../../Components/common/Heading";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-20 flex flex-col justify-center space-y-10 bg-gray-100">
      {/* Heading */}
      <Heading title={"Hear From Folks"} />

      {/* Reviews */}
      <div className="place-content-center w-full px-homepagePadding">
        <Slider {...settings}>
          {[...Array(6)].map((_, index) => ( // Assuming you want to render 6 testimonial cards
            <LazyMotion features={domAnimation} key={index}>
              <m.div
                initial={{ scale: 1, opacity: 1 }} // Initial state: normal size and fully visible
                whileHover={{ scale: 0.95, opacity: 0.9 }} // Scale down and decrease opacity on hover
                transition={{ duration: 0.3 }} // Animation duration
              >
                <TestimonialCard customerImg={customerImg} />
              </m.div>
            </LazyMotion>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
