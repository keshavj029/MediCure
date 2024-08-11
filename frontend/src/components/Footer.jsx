import React from "react";
const Footer = () => {
  return (
    <div className="py-6 bg-blue-500">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-sm text-black">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>
         
        </div>
     
        
      </div>
    </div>
  );
};

export default Footer;
