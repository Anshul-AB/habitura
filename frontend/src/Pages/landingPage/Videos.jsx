import React, { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion"; // Import necessary components from Framer Motion
import YoutubeVideoCard from "../../Components/cards/YoutubeVideoCard";
import Heading from "../../Components/common/Heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Videos = () => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 3, once: true });

  return (
    <section className="py-20 bg-gray-100">
      <Heading title={"Progress Videos"} />
      <div className="place-content-center w-full pt-5 px-homepagePadding" ref={ref}>
        <Slider {...settings}>
          {[...Array(3)].map((_, index) => (
            <LazyMotion features={domAnimation} key={index}>
              <m.div
                initial={{ opacity: 0, y: 20 }} // Initial state: invisible and slightly below
                animate={isInView ? { opacity: 1, y: 0 }:{}} // Final state: visible and in place
                transition={{ duration: 0.5, delay: index * 0.2 }} // Add a delay for staggered effect
              >
                <YoutubeVideoCard />
              </m.div>
            </LazyMotion>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Videos;
