import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Heading from "../../Components/common/Heading";

const Howitworks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold:1, once: true }); 
  return (
    <section className="py-24 bg-gray-100">
      <div className="" ref={ref}>
        <Heading title={"How It Works!"} classname={'!mb-16'} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center px-homepagePadding">
          {instructions.map((instruction, index) => (
            <motion.div
              key={index}
              className="bg-primary p-6 rounded-full h-72 w-72 shadow-md flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}} 
              transition={{ duration: 1, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={instruction.icon} alt="" className="w-16 h-16 mb-4" />
              <h3 className="font-medium text-darkgreen text-lg text-center">
                {instruction.title}
              </h3>
              <p className="text-secondary text-sm text-center">{instruction.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const instructions = [
  {
    title: "Create Your Habits",
    text: "You can create habits for yourself, select a start date, and track challenges or just count streaks.",
    icon: "path/to/icon1.svg",
  },
  {
    title: "Daily Task List",
    text: "Your habits will automatically be added to your dashboard task list each day for you to mark.",
    icon: "path/to/icon2.svg",
  },
  {
    title: "Set Daily Tasks",
    text: "Set your daily tasks on the dashboard with CRUD functionality and drag functionality.",
    icon: "path/to/icon3.svg",
  },
];

export default Howitworks;
