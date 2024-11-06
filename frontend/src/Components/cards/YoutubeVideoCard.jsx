import React from "react";

const YoutubeVideoCard = () => {
  return (
    <div class="video-card bg-coolsecondary bg-opacity-40  p-4 m-5 rounded-md shadow-md">
      <div class="video mb-4">
        <iframe
          class="w-full h-48"
          src="https://www.youtube.com/shorts/fzA8JqyU0dE"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <h3 class="text-lg text-darkgreen font-medium">Personal Progress: Week 1</h3>
      <p class="text-paragraph text-sm">
        A brief overview of my first week of habit tracking.
      </p>
    </div>
  );
};

export default YoutubeVideoCard;
