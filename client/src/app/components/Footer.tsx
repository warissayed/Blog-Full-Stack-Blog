import React from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black  text-white py-8 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/2 md:w-1/4 mb-4 md:mb-0">
            <h4 className="text-lg font-bold mb-2">Company</h4>
            <ul>
              <li>
                <Link href="/login">About</Link>
              </li>
              <li>
                <Link href="/login">Careers</Link>
              </li>
              <li>
                <Link href="/login">Press</Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 mb-4 md:mb-0">
            <h4 className="text-lg font-bold mb-2">Resources</h4>
            <ul>
              <li>
                <Link href="/login">Blog</Link>
              </li>
              <li>
                <Link href="/login">Documentation</Link>
              </li>
              <li>
                <Link href="/login">Community</Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 mb-4 md:mb-0">
            <h4 className="text-lg font-bold mb-2">Support</h4>
            <ul>
              <li>
                <Link href="/login">Contact</Link>
              </li>
              <li>
                <Link href="/login">FAQ</Link>
              </li>
              <li>
                <Link href="/login">Help Center</Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <h4 className="text-lg font-bold mb-2">Follow Us</h4>
            <ul className="flex">
              <li className="mr-4">
                <Link href="/login">
                  <i className="fab fa-twitter">
                    <FaTwitter />
                  </i>
                </Link>
              </li>
              <li className="mr-4">
                <Link href="/login">
                  <i className="fab fa-facebook">
                    <FaFacebook />
                  </i>
                </Link>
              </li>
              <li className="mr-4">
                <Link href="/login">
                  <i className="fab fa-instagram">
                    <FaInstagram />
                  </i>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <i className="fab fa-linkedin">
                    <FaLinkedin />
                  </i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Tan-Automation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
