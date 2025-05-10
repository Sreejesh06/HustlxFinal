import { Link } from "wouter";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DualInterface = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Explore Our Dual Interface</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            EmpowerHer offers tailored experiences for both homemakers and customers, creating a seamless marketplace ecosystem.
          </p>
        </div>
        
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-6">
          {/* Homemaker Interface */}
          <div className="md:w-1/2 bg-primary bg-opacity-5 rounded-xl p-6 border border-primary border-opacity-20 custom-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                <i className="ri-home-heart-line text-xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-primary">Homemaker Interface</h3>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-primary mr-2 h-5 w-5" />
                <span>Showcase your skills with AI-verified badges</span>
              </li>
              <li className="flex items-center">
                <Check className="text-primary mr-2 h-5 w-5" />
                <span>Create and manage service or product listings</span>
              </li>
              <li className="flex items-center">
                <Check className="text-primary mr-2 h-5 w-5" />
                <span>Track orders, earnings, and customer ratings</span>
              </li>
              <li className="flex items-center">
                <Check className="text-primary mr-2 h-5 w-5" />
                <span>Access business resources and mentorship</span>
              </li>
              <li className="flex items-center">
                <Check className="text-primary mr-2 h-5 w-5" />
                <span>Apply for micro-loans and growth opportunities</span>
              </li>
            </ul>
            
            {/* Preview of homemaker dashboard */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Homemaker dashboard interface" 
                className="w-full h-auto rounded" 
              />
              <p className="text-sm text-gray-500 mt-2 text-center">Homemaker Dashboard</p>
            </div>
          </div>
          
          {/* Customer Interface */}
          <div className="md:w-1/2 bg-secondary bg-opacity-5 rounded-xl p-6 border border-secondary border-opacity-20 custom-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white mr-4">
                <i className="ri-shopping-bag-line text-xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary">Customer Interface</h3>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-secondary mr-2 h-5 w-5" />
                <span>Discover verified local homemaker services</span>
              </li>
              <li className="flex items-center">
                <Check className="text-secondary mr-2 h-5 w-5" />
                <span>Browse by category, price, or rating</span>
              </li>
              <li className="flex items-center">
                <Check className="text-secondary mr-2 h-5 w-5" />
                <span>View detailed profiles with skill badges</span>
              </li>
              <li className="flex items-center">
                <Check className="text-secondary mr-2 h-5 w-5" />
                <span>Book services or purchase products securely</span>
              </li>
              <li className="flex items-center">
                <Check className="text-secondary mr-2 h-5 w-5" />
                <span>Leave reviews and support local talent</span>
              </li>
            </ul>
            
            {/* Preview of customer interface */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Customer browsing interface" 
                className="w-full h-auto rounded" 
              />
              <p className="text-sm text-gray-500 mt-2 text-center">Customer Marketplace View</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualInterface;
