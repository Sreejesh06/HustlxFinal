import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, Cpu, ShoppingBag } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">
            How EmpowerHer Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to showcase your skills, get verified, and connect with customers ready to buy your services or products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center custom-shadow">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Create Your Profile</h3>
            <p className="text-gray-600">
              Sign up as a homemaker and tell us about your skills, experience and the services or products you offer.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center custom-shadow">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Get AI Verification</h3>
            <p className="text-gray-600">
              Upload samples of your work. Our AI assesses your skills and provides verification badges to build credibility.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center custom-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Start Earning</h3>
            <p className="text-gray-600">
              Create listings for your services or products, set your prices, and start receiving orders from customers.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/skill-verification">
            <Button variant="link" className="text-primary font-semibold hover:text-primary-dark">
              Learn more about our process
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
