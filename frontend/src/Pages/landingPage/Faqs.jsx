import React, { useState } from "react";
import Heading from "../../Components/common/Heading";
import AccordianCard from "../../Components/cards/AccordianCard";

const Faqs = () => {
  return (
    <div>
      <section id="faq" className="py-16 bg-gray-100">
        <Heading title={"Frequently Asked Questions"} />
        <div className="px-homepagePadding pt-5">
          {/* Faq's */}
          <AccordianCard
            visibleText={" What is Habitura?"}
            hiddenText={
              "Habitura is a platform designed to help you build and maintain good habits through daily tracking and community support."
            }
          />
          <AccordianCard
            visibleText={"How does the habit tracking work?"}
            hiddenText={
              "Our habit tracking feature allows you to set goals, track your progress, and receive reminders to keep you on track."
            }
          />
          <AccordianCard
            visibleText={" Can I use Habitura for free?"}
            hiddenText={
              "Yes, we offer a free plan with basic features. For more advanced features, you can upgrade to our premium or pro plans."
            }
          />
          <AccordianCard
            visibleText={"How do I contact support?"}
            hiddenText={
              "You can contact our support team via the contact form on our website or by emailing support@habitandhustle.com."
            }
          />
        </div>
      </section>
    </div>
  );
};

export default Faqs;
