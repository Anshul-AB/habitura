import React from "react";

const TestimonialCard = ({ customerImg }) => {
  return (
    <div className="shadow-md rounded-md bg-[#dcb595] bg-opacity-30 flex flex-col m-5 p-10">
      {/* Customer image */}
      <div className="col-span-1 flex items-start justify-center">
        <img
          src={customerImg}
          alt="Customer photo"
          className="h-16 w-16 rounded-full"
        />
      </div>

      {/* Customer review content */}
      <div className="col-span-4">
        <p className="mb-4 text-sm font-handwritten text-paragraph text-center z-10">
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam
          recusandae repudiandae quia similique repellat eum at assumenda
          praesentium quas qui eaque reprehenderit eius ea, mollitia rem tenetur
          maiores dolor nostrum."
        </p>
        <div className="flex flex-col ">
          <p className="text-lg text-center text-habit font-medium">
            John Ball / Designer
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
