import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const CTA = () => {
  const { setShowSignUpModal, isAuthenticated } = useAuth();

  const handleHomemakerSignup = () => {
    setShowSignUpModal(true);
  };

  const handleCustomerSignup = () => {
    setShowSignUpModal(true);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
          Ready to Transform Your Skills Into Income?
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
          Join thousands of homemakers who are building businesses, earning income, and gaining confidence through EmpowerHer.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center mb-12">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition duration-200">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Button 
                size="lg"
                onClick={handleHomemakerSignup}
                className="px-8 py-6 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition duration-200"
              >
                Start as a Homemaker
              </Button>
              <Button 
                size="lg"
                onClick={handleCustomerSignup}
                className="px-8 py-6 bg-accent text-white font-bold rounded-md hover:bg-accent-light transition duration-200"
              >
                Join as a Customer
              </Button>
            </>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold mb-1">25,000+</span>
            <span className="text-sm opacity-90">Verified Homemakers</span>
          </div>
          <div className="hidden md:block h-12 w-px bg-white opacity-20"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold mb-1">100,000+</span>
            <span className="text-sm opacity-90">Customers</span>
          </div>
          <div className="hidden md:block h-12 w-px bg-white opacity-20"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold mb-1">$4.2M+</span>
            <span className="text-sm opacity-90">Earned by Homemakers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
