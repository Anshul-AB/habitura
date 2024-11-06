import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-darkestgreen text-white py-6">
      <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
        {/* Navigation Links */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-x-4 flex lg:space-y-2 lg:space-x-0 lg:flex-col">
            <li>
              <a href="#about" className="hover:text-gray-400">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-400">
                Contact
              </a>
            </li>
            <li>
              <a href="#blog" className="hover:text-gray-400">
                Blog
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-gray-400">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-400">
            Email:{" "}
            <a
              href="mailto:support@habitandhustle.com"
              className="hover:text-gray-300"
            >
              support@habitura.com
            </a>
          </p>
          <p className="text-gray-400">
            Phone:{" "}
            <a href="#" className="hover:text-gray-300">
              +1 (123) 456-7890
            </a>
          </p>
        </div>

      </div>

      {/* copyright */}
      <div className="text-center text-sm mt-4 border-t border-gray-700 pt-4">
        <p className="text-gray-400">
          &copy; 2024 Habitura. All rights reserved.
        </p>
      </div>
      
    </footer>
  );
};

export default Footer;
