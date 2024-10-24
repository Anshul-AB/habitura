// import React, { Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Element } from "react-scroll";
// import ScrollToTop from "./Components/common/ScrollToTop";
// import LoadingSpinner from "./Components/common/LoadingSpinner";
// // landing page
// import Features from "./Pages/landingPage/Features";
// import Howitworks from "./Pages/landingPage/Howitworks";
// import Testimonials from "./Pages/landingPage/Testimonials";
// import Videos from "./Pages/landingPage/Videos";
// import Subscription from "./Pages/landingPage/Subscription";
// import Faqs from "./Pages/landingPage/Faqs";
// import Footer from "./Pages/landingPage/Footer";
// import Aboutus from "./Pages/landingPage/Aboutus";

// // Routes
// import Signup from "./Pages/routes/Signup";
// import Login from "./Pages/routes/Login";
// import Home from "./Pages/landingPage/Home";
// import Dashboard from "./Pages/routes/Dashboard";
// import MyHabits from "./Pages/routes/MyHabits";
// import PrivateRoute from "./Components/privateRoute/PrivateRoute";
// import HabitInfo from "./Components/Habit/HabitInfo";
// import MyProfile from "./Pages/routes/MyProfile";
// import Settings from "./Pages/routes/Settings";

// const App = () => {

//   return (
//     <div className="box-border font-primary">
//       <ScrollToTop />
//       <Suspense fallback={<LoadingSpinner/>}>
//       <Routes>
//         {/* landing Page */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Element name="home">
//                 <Home />
//               </Element>

//               <Element name="aboutus">
//                 <Aboutus />
//               </Element>

//               <Element name="features">
//                 <Features />
//               </Element>

//               <Element name="howitworks">
//                 <Howitworks />
//               </Element>

//               <Element name="testimonials">
//                 <Testimonials />
//               </Element>

//               <Element name="videos">
//                 <Videos />
//               </Element>

//               <Element name="subscription">
//                 <Subscription />
//               </Element>

//               <Element name="faqs">
//                 <Faqs />
//               </Element>
//             </>
//           }
//         />

//         {/* Public routes */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />

//         {/* Protected Routes */}
//         <Route
//           path="/dashboard"
//           element={<PrivateRoute element={<Dashboard />} />}
//         />
//         <Route
//           path="/myHabits"
//           element={<PrivateRoute element={<MyHabits />} />}
//         />
//         <Route
//           path="/habitInfo/:id"
//           element={<PrivateRoute element={<HabitInfo />} />}
//         />
//         <Route
//           path="/my-profile"
//           element={<PrivateRoute element={<MyProfile />} />}
//         />
//         <Route
//           path="/settings"
//           element={<PrivateRoute element={<Settings />} />}
//         />
//       </Routes>
//       <Footer />
//       </Suspense>
//     </div>
//   );
// };



// export default App;


import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom"; // Don't wrap <Router> here
import { Element } from "react-scroll";
import ScrollToTop from "./Components/common/ScrollToTop";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner";

// Lazy load components
const Features = lazy(() => import("./Pages/landingPage/Features"));
const Howitworks = lazy(() => import("./Pages/landingPage/Howitworks"));
const Testimonials = lazy(() => import("./Pages/landingPage/Testimonials"));
const Videos = lazy(() => import("./Pages/landingPage/Videos"));
const Subscription = lazy(() => import("./Pages/landingPage/Subscription"));
const Faqs = lazy(() => import("./Pages/landingPage/Faqs"));
const Footer = lazy(() => import("./Pages/landingPage/Footer"));
const Aboutus = lazy(() => import("./Pages/landingPage/Aboutus"));
const Signup = lazy(() => import("./Pages/routes/Signup"));
const Login = lazy(() => import("./Pages/routes/Login"));
const Home = lazy(() => import("./Pages/landingPage/Home"));
const Dashboard = lazy(() => import("./Pages/routes/Dashboard"));
const MyHabits = lazy(() => import("./Pages/routes/MyHabits"));
const PrivateRoute = lazy(() => import("./Components/privateRoute/PrivateRoute"));
const HabitInfo = lazy(() => import("./Components/Habit/HabitInfo"));
const MyProfile = lazy(() => import("./Pages/routes/MyProfile"));
const Settings = lazy(() => import("./Pages/routes/Settings"));

const App = () => {
  return (
    <div className="box-border font-primary">
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Landing Page */}
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
      </Suspense>
    </div>
  );
};

export default App;
