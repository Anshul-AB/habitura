import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

const AccordianCard = ({ visibleText, hiddenText }) => {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  return (
    <div className="rounded-full border border-coolsecondary m-1 font-primary p-4 cursor-pointer">
    {/* visible content */}
    <div className="flex justify-between items-center mx-3" onClick={toggle}>
      <div className="text-secondary text-lg font-medium font-primary">
        {visibleText}
      </div>
      <div className="text-2xl text-paragraph cursor-pointer" >
        {show ? <FaAngleUp /> : <FaAngleDown />}
      </div>
    </div>

    {/* hidden content  */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out mx-3 text-base text-paragraph p-1 text-left ${
        show ? "max-h-40 opacity-100 p-3" : "max-h-0 opacity-0 p-0"
      }`}
    >
      {hiddenText}
    </div>
  </div>
  );
};

export default AccordianCard;
