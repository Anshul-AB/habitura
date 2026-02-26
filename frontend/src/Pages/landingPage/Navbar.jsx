import React, { useEffect, useState } from "react";
import Logowomen from "../../assets/HabituraCropLogo.png";
import NavButton from "../../Components/buttons/NavButton";
import { Link, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import OutsideClickHandler from "react-outside-click-handler";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../../utils/serverHelpers";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [showMenu, setShowMenu] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Navbar toggle
  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

  // Profile menu toggle
  const toggleMenu = () => setShowMenu(!showMenu);

  const logout = () => {
    removeCookie("token", { path: "/" });
  };

    // submit form
    const submit = async () => {
      try {
        console.log("Clicked.............")
        const response = await makeAuthenticatedPOSTRequest(
          "/auth/guestUser"
        );
        console.log("form data submitted", response);
  
        if (response && response.token) {
          const token = response.token;
  
          if (token) {
            const date = new Date();
            date.setDate(date.getDate() + 10);
            setCookie("token", token, { path: "/", expires: date });
  
            Navigate("/dashboard");
          } else {
            console.error("No token found in the response.");
          }
        } else {
          console.error("The Form not submitted successfully");
        }
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    };

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          "/updateUser/getProfile"
        );
        setProfilePicture(response.profilePicture);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
  {/* NAVBAR WRAPPER */}
  <div className="w-full flex justify-between items-center py-3 relative z-20">

    {/* Logo */}
    <div className="flex justify-center items-center cursor-pointer space-x-2">
      <img
        src={Logowomen}
        alt="Habitura Logo"
        className="rounded-full h-12 w-12 sm:h-14 sm:w-14"
      />
      <div className="font-logo text-darkgreen font-semibold text-2xl sm:text-3xl lg:text-4xl">
        Habitura
      </div>
    </div>

    {/* Desktop nav links */}
    <div className="hidden lg:flex space-x-6 justify-center items-center">
      <NavButton buttonLabel={"Home"} target={"home"} />
      <NavButton buttonLabel={"About Us"} target={"aboutus"} />
      <NavButton buttonLabel={"Features"} target={"features"} />
      <NavButton buttonLabel={"How It works"} target={"howitworks"} />
      <NavButton buttonLabel={"Success Stories"} target={"testimonials"} />
      <NavButton buttonLabel={"Personal Progress"} target={"videos"} />
      <NavButton buttonLabel={"Subscription"} target={"subscription"} />
      <NavButton buttonLabel={"FAQs"} target={"faqs"} />
    </div>

    {/* Right side (auth + mobile menu) */}
    <div className="flex items-center space-x-3">

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button onClick={toggleNavbar} className="text-darkgreen">
          {isNavbarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Profile / Auth */}
      {cookie.token ? (
        <OutsideClickHandler
          onOutsideClick={(e) => {
            setShowMenu(false);
            e.stopPropagation();
          }}
        >
          <div className="relative" onClick={toggleMenu}>
            <img
              src={profilePicture}
              alt="Profile"
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 cursor-pointer"
            />

            {showMenu && (
              <div className="absolute top-14 right-0 flex flex-col bg-coolsecondary bg-opacity-90 rounded-lg shadow-lg font-medium text-white w-48">
                <Link to="/my-profile">
                  <button className="p-3 w-full text-left hover:bg-gray-300 hover:text-coolsecondary rounded-t-lg">
                    My Profile
                  </button>
                </Link>
                <button
                  className="p-3 w-full bg-red-400 hover:bg-red-600 text-left rounded-b-lg"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </OutsideClickHandler>
      ) : (
        <div className="hidden sm:flex items-center gap-2">
          <Link to="/login">
            <div className="font-primary text-sm bg-secondary px-3 py-2 rounded-full shadow-md hover:scale-105 transition">
              Login
            </div>
          </Link>
          <Link to="/signup">
            <div className="font-primary text-sm bg-secondary px-3 py-2 rounded-full shadow-md hover:scale-105 transition">
              Signup
            </div>
          </Link>
          <div onClick={submit}>
            <div className="font-primary text-sm bg-secondary px-3 py-2 rounded-full shadow-md hover:scale-105 transition cursor-pointer">
              Guest
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Mobile dropdown menu */}
  {isNavbarOpen && (
    <div className="lg:hidden absolute top-20 right-36 z-50 flex flex-col space-y-3 p-4 bg-coolsecondary bg-opacity-90 text-white shadow-lg">
      <NavButton buttonLabel={"Home"} target={"home"} />
      <NavButton buttonLabel={"About Us"} target={"aboutus"} />
      <NavButton buttonLabel={"Features"} target={"features"} />
      <NavButton buttonLabel={"How It works"} target={"howitworks"} />
      <NavButton buttonLabel={"Success Stories"} target={"testimonials"} />
      <NavButton buttonLabel={"Personal Progress"} target={"videos"} />
      <NavButton buttonLabel={"Subscription"} target={"subscription"} />
      <NavButton buttonLabel={"FAQs"} target={"faqs"} />

      {!cookie.token && (
        <div className="flex flex-col gap-2 pt-2 sm:hidden">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <div onClick={submit}>Guest User</div>
        </div>
      )}
    </div>
  )}
</>
  );
};

export default Navbar;
