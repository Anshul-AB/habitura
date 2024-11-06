import React from "react";
import SecBtn from "../../Components/buttons/SecBtn";
import Heading from "../../Components/common/Heading";
import bgImg from "../../assets/aboutusPng.png"; // Correctly import the image

const Aboutus = () => {
  return (
    <div className="relative flex items-center justify-between pt-44 bg-gray-100 px-homepagePadding">
      {/* Left side - Background image */}
      <div
        className="absolute top-36 right-14 w-3/4 lg:w-1/2 h-full bg-cover bg-center opacity-30 lg:opacity-70"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      {/* Right side - Text content */}
      <div className=" flex flex-col  pb-10 space-y-10 z-10">
        {/* Heading */}
        <Heading title={"About Us"} classname={"!text-left"} />

        {/* Quote */}
        <div className="w-full lg:w-1/2 !text-left">
          <p className="text-xl text-paragraph font-handwritten lg:text-opacity-70 italic">
            “From documenting our habit-building journey on YouTube to creating
            a comprehensive platform for tracking your progress, Habitura is
            here to help you transform your daily routines into lasting
            success.”
          </p>
        </div>

        {/* Button */}
        <div className="w-full lg:w-1/2">
          <SecBtn buttonLabel={"Know More"} />
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
