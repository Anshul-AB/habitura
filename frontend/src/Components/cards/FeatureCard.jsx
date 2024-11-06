import React from "react";

const FeatureCard = ({ icon, title, text, imgSrc, imgClassname, altText }) => {
  return (
    <div className="feature-card p-6 bg-primary bg-opacity-40 shadow-md rounded-lg h-full">
      <div className="flex items-center mb-4">
        <>{icon}</>
        <h3 className="text-xl font-semibold ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{text}</p>
      <a href={imgSrc} target="_blank" rel="noopener noreferrer">
        <img
          src={imgSrc}
          alt={altText}
          className={`mt-4 w-full rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110 ${imgClassname}`}
        />
      </a>
    </div>
  );
};

export default FeatureCard;
