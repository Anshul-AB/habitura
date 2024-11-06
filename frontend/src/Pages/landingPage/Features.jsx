import React, { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import Heading from "../../Components/common/Heading";
import FeatureCard from "../../Components/cards/FeatureCard";
import habitTrackingScreenshot from "../../assets/habitTracking.png";
import dailyProgressScreenshot from "../../assets/dailyProgress.png";
import notesFeatureScreenshot from "../../assets/notesFeature.png";
import communitySupportScreenshot from "../../assets/communitySupport.png";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 1, once: true });

  return (
    <LazyMotion features={domAnimation}>
      <div>
        <section className="py-20 pt-48 bg-gray-100">
          <div className="px-homepagePadding">
            <Heading title={"Features"} classname={"!text-left"} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-5" ref={ref}>
              {/* Daily progress */}
              <m.div
                initial={{ x: -100, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2 2l4-4l4 4l6-6"></path>
                    </svg>
                  }
                  title={"Daily Progress"}
                  text={"Monitor your daily achievements and maintain streaks to stay motivated. Our visual progress indicators make tracking easy."}
                  imgSrc={dailyProgressScreenshot}
                  altText={"daily progress snapshot"}
                  imgClassname={"h-36"}
                />
              </m.div>

              {/* Habit tracking */}
              <m.div
                initial={{ x: -150, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  }
                  title={"Habit Tracking & Streaks"}
                  text={"Set, track, and monitor your habits with our intuitive interface. Easily see your progress and make adjustments as needed."}
                  imgSrc={habitTrackingScreenshot}
                  altText={"Habit Tracking & Streaks snapshot"}
                  imgClassname={"h-36"}
                />
              </m.div>

              {/* Quick notes */}
              <m.div
                initial={{ x: -200, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2l4-4l-6-6"></path>
                    </svg>
                  }
                  title={"Quick Notes"}
                  text={"A built-in notepad on the dashboard lets users jot down quick thoughts, goals, and reminders to support their habit journey."}
                  imgSrc={notesFeatureScreenshot}
                  altText={"Quick Notes snapshot"}
                  imgClassname={"h-36"}
                />
              </m.div>

              {/* Community support */}
              <m.div
                initial={{ x: -250, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-black bg-opacity-55 shadow-lg rounded-lg flex items-center justify-center text-primary text-xl font-semibold">
                  Coming Soon
                </div>
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4l3 3l3-3V4"></path>
                    </svg>
                  }
                  title={"Community & Support"}
                  text={"Connect with a supportive community and access resources to stay motivated. Share your journey and get advice from peers."}
                  imgSrc={communitySupportScreenshot}
                  altText={"Community & Support snapshot"}
                  imgClassname={"h-36"}
                />
              </m.div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Features;
