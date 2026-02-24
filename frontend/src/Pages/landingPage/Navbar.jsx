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
      {/* Logo */}
      <div className="flex justify-center items-center cursor-pointer z-10 space-x-2">
        <img
          src={Logowomen}
          alt="Habitura Logo"
          height={70}
          width={70}
          className="rounded-full"
        />
        <div className="font-logo text-darkgreen font-semibold text-4xl z-10 mt-3">
          Habitura
        </div>
      </div>

      {/* Navbar menu */}

      {/* nav links for small screens */}
      <div className="relative max-lg:hidden p-4 z-10 w-full flex justify-end">
        <button onClick={toggleNavbar} className="text-darkgreen">
          {isNavbarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {isNavbarOpen && (
          <div className="flex flex-col justify-start items-start space-y-4 p-4 absolute top-16 right-0 bg-coolsecondary bg-opacity-50 rounded-lg shadow-lg font-medium text-white w-48 z-20">
            <NavButton buttonLabel={"Home"} target={"home"} />
            <NavButton buttonLabel={"About Us"} target={"aboutus"} />
            <NavButton buttonLabel={"Features"} target={"features"} />
            <NavButton buttonLabel={"How It works"} target={"howitworks"} />
            <NavButton
              buttonLabel={"Success Stories"}
              target={"testimonials"}
            />
            <NavButton buttonLabel={"Personal Progress"} target={"videos"} />
            <NavButton buttonLabel={"Subscription"} target={"subscription"} />
            <NavButton buttonLabel={"FAQs"} target={"faqs"} />
          </div>
        )}
      </div>

      {/* nav links for larger screens */}
      <div
        className={`hidden  space-x-6 max-lg:flex justify-center items-center z-10 `}
      >
        <NavButton buttonLabel={"Home"} target={"home"} />
        <NavButton buttonLabel={"About Us"} target={"aboutus"} />
        <NavButton buttonLabel={"Features"} target={"features"} />
        <NavButton buttonLabel={"How It works"} target={"howitworks"} />
        <NavButton buttonLabel={"Success Stories"} target={"testimonials"} />
        <NavButton buttonLabel={"Personal Progress"} target={"videos"} />
        <NavButton buttonLabel={"Subscription"} target={"subscription"} />
        <NavButton buttonLabel={"FAQs"} target={"faqs"} />
      </div>

      {/* logins */}
      <div className="flex items-center cursor-pointer z-10">
        {cookie.token ? (
          <>
            {/* Profile */}
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
                  className="rounded-full h-12 lg:w-12 w-16"
                />

                {/* Profile Menu */}
                {showMenu && (
                  <div className="absolute top-16 right-0 flex flex-col bg-coolsecondary bg-opacity-90 rounded-lg shadow-lg font-medium text-white w-48">
                    <Link to="/my-profile">
                      <button className="p-3 w-full text-left hover:bg-gray-300 hover:text-coolsecondary transition-colors duration-300 rounded-t-lg">
                        My Profile
                      </button>
                    </Link>
                    <button
                      className="p-3 w-full bg-red-400 hover:bg-red-600 text-left transition-colors duration-300 rounded-b-lg"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </OutsideClickHandler>
          </>
        ) : (
          <div className="flex flex-col justify-start items-start mt-20">
            <Link to="/login">
              <div className="font-primary text-base text-primary bg-secondary px-3 py-2 mb-2 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105">
                Login
              </div>
            </Link>
            <Link to="/signup">
              <div className="font-primary text-base text-primary bg-secondary px-3 py-2 mb-2 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105">
                Signup
              </div>
            </Link>
            <div  onClick={submit}>
              <div className="font-primary text-base text-primary bg-secondary px-3 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105">
                Guest User
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
