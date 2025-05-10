import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold mb-4">
              <span className="font-heading">Empower<span className="text-accent">Her</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming homemaker skills into thriving businesses through AI-powered verification and marketplace connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Homemakers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">How It Works</a></li>
              <li><Link href="/skill-verification" className="hover:text-white transition">Skill Assessment</Link></li>
              <li><Link href="/create-listing" className="hover:text-white transition">Create Listings</Link></li>
              <li><a href="#" className="hover:text-white transition">Pricing & Fees</a></li>
              <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition">Micro-loans</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Customers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/marketplace" className="hover:text-white transition">Browse Services</Link></li>
              <li><a href="#" className="hover:text-white transition">How To Order</a></li>
              <li><a href="#" className="hover:text-white transition">Verification Explained</a></li>
              <li><a href="#" className="hover:text-white transition">Payments & Security</a></li>
              <li><a href="#" className="hover:text-white transition">Customer Reviews</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Mission & Values</a></li>
              <li><a href="#" className="hover:text-white transition">Press & Media</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Partner With Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} EmpowerHer. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition">Cookie Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
