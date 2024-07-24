import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TripScript. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
