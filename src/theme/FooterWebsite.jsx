import React from 'react';
import { Facebook, Youtube, Linkedin, Instagram } from 'lucide-react'; // Replace Twitter with Youtube

const socialMediaLinks = [
  {
    icon: <Linkedin size={30} />,
    url: "https://www.linkedin.com/in/sandesh-bajracharya-238104250/",
  },
  {
    icon: <Youtube size={30} />,
    url: "https://www.youtube.com/@SandeshBajracharya",
  },
  {
    icon: <Facebook size={30} />,
    url: "https://www.facebook.com/sandesh.buzz",
  },
  {
    icon: <Instagram size={30} />,
    url: "https://www.instagram.com/sandes.sb/",
  },
];

const FooterWebsite = () => {
  return (
    <footer className="relative bg-gradient-to-b from-primary-bg/70 via-secondary/90 to-sidebar-bg/100 text-white">
      {/* SVG Wave */}
      <div className="absolute bottom-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#f0f4fc"
            fillOpacity="1"
            d="M0,192L80,202.7C160,213,320,235,480,208C640,181,800,107,960,96C1120,85,1280,139,1360,165.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer Content */}
      <div className='flex justify-center items-center'>
      <div className="relative container py-8 text-center">
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-4 text-gray-500">
          {socialMediaLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              {social.icon}
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          ©2024 Sandesh Bajracharya | All Rights Reserved
        </p>
      </div>

      </div>
    
    </footer>
  );
};

export default FooterWebsite;
