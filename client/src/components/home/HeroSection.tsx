import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const HeroSection = () => {
  const { setShowSignUpModal, isAuthenticated } = useAuth();

  const handleHomemakerSignup = () => {
    setShowSignUpModal(true);
  };

  const handleCustomerSignup = () => {
    setShowSignUpModal(true);
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">
            Turn Your Skills Into Income
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            EmpowerHer helps homemakers verify their skills, build a professional portfolio, and connect with customers who value their talents.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="px-6 py-6 bg-accent text-gray-900 font-semibold rounded-md hover:bg-accent-light transition duration-200">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  onClick={handleHomemakerSignup}
                  className="px-6 py-6 bg-accent text-gray-900 font-semibold rounded-md hover:bg-accent-light transition duration-200"
                >
                  Join as Homemaker
                </Button>
                <Button 
                  onClick={handleCustomerSignup}
                  variant="outline"
                  className="px-6 py-6 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition duration-200"
                >
                  Join as Customer
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-8 flex items-center text-sm">
            <span className="mr-3 text-accent-light">Trusted by 25,000+ homemakers</span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                <i className="ri-check-line"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <i className="ri-shield-check-line"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-info flex items-center justify-center">
                <i className="ri-star-line"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
            alt="Diverse homemakers showcasing their skills" 
            className="rounded-xl shadow-xl w-full h-auto" 
          />
          
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center mb-2">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                alt="Customer" 
                className="w-10 h-10 rounded-full mr-3" 
              />
              <div>
                <p className="font-medium text-gray-900">Sarah J.</p>
                <div className="flex text-yellow-400 text-xs">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm quote italic">
              "EmpowerHer helped me turn my baking hobby into a thriving home business!"
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
