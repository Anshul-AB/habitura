import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Element } from "react-scroll";
import ScrollToTop from "./Components/common/ScrollToTop";

// landing page
import Features from "./Pages/landingPage/Features";
import Howitworks from "./Pages/landingPage/Howitworks";
import Testimonials from "./Pages/landingPage/Testimonials";
import Videos from "./Pages/landingPage/Videos";
import Subscription from "./Pages/landingPage/Subscription";
import Faqs from "./Pages/landingPage/Faqs";
import Footer from "./Pages/landingPage/Footer";
import Aboutus from "./Pages/landingPage/Aboutus";

// Routes
import Signup from "./Pages/routes/Signup";
import Login from "./Pages/routes/Login";
import Home from "./Pages/landingPage/Home";
import Dashboard from "./Pages/routes/Dashboard";
import MyHabits from "./Pages/routes/MyHabits";
import PrivateRoute from "./Components/privateRoute/PrivateRoute";
import HabitInfo from "./Components/Habit/HabitInfo";
import MyProfile from "./Pages/routes/MyProfile";
import Settings from "./Pages/routes/Settings";

const App = () => {
  return (
    <div className="box-border font-primary">
      <ScrollToTop />

      <Routes>
        {/* landing Page */}
        <Route
          path="/"
          element={
            <>
              <Element name="home">
                <Home />
              </Element>

              <Element name="aboutus">
                <Aboutus />
              </Element>

              <Element name="features">
                <Features />
              </Element>

              <Element name="howitworks">
                <Howitworks />
              </Element>

              <Element name="testimonials">
                <Testimonials />
              </Element>

              <Element name="videos">
                <Videos />
              </Element>

              <Element name="subscription">
                <Subscription />
              </Element>

              <Element name="faqs">
                <Faqs />
              </Element>
            </>
          }
        />

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          path="/myHabits"
          element={<PrivateRoute element={<MyHabits />} />}
        />
        <Route
          path="/habitInfo/:id"
          element={<PrivateRoute element={<HabitInfo />} />}
        />
        <Route
          path="/my-profile"
          element={<PrivateRoute element={<MyProfile />} />}
        />
        <Route
          path="/settings"
          element={<PrivateRoute element={<Settings />} />}
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
