import React, { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import Heading from "../../Components/common/Heading";

const plans = [
  {
    title: "Free Plan",
    description: "Basic habit tracking with essential features.",
    price: "$0",
    features: ["Basic habit tracking", "Daily reminders", "Community support"],
    buttonText: "Get Started",
    bgColor: "bg-primary bg-opacity-40",
  },
  {
    title: "Premium Plan",
    description: "Advanced features for serious habit trackers.",
    price: "$9.99/month",
    features: [
      "Advanced habit tracking",
      "Custom reminders and goals",
      "Exclusive content",
      "Priority support",
    ],
    buttonText: "Start Free Trial",
    bgColor: "bg-white",
  },
  {
    title: "Pro Plan",
    description: "All-inclusive features for the ultimate experience.",
    price: "$19.99/month",
    features: [
      "All premium features",
      "Personalized coaching",
      "Access to new features first",
    ],
    buttonText: "Upgrade Now",
    bgColor: "bg-primary bg-opacity-50",
  },
];

const Subscription = () => {
  const cardVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 1, once: true });

  return (
    <LazyMotion features={domAnimation}>

    <section className="bg-gray-100">
      <div className="py-20">
        <Heading title={"Choose Your Plan"} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-homepagePadding pt-5" ref={ref}>
          {plans.map((plan, index) => (
            <m.div
              key={index}
              className={`flex flex-col justify-between p-6 rounded-md shadow-md ${plan.bgColor}`}
              initial="hidden"
              animate={isInView ? "visible":{}}
              transition={{ delay: index * 0.3, duration: 0.9, type: "spring" }}
              variants={cardVariants}
            >
              <h3 className="text-2xl text-secondary font-semibold mb-4">{plan.title}</h3>
              <p className="text-paragraph mb-4">{plan.description}</p>
              <div className="text-darkgreen text-4xl font-bold mb-4">{plan.price}</div>
              <ul className="mb-6 opacity-70 text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <a
                href="#"
                className="bg-darkgreen bg-opacity-80 text-white py-2 px-4 rounded-lg transition-colors hover:bg-opacity-60"
              >
                {plan.buttonText}
              </a>
            </m.div>
          ))}
        </div>
      </div>
    </section>
    </LazyMotion>

  );
};

export default Subscription;
