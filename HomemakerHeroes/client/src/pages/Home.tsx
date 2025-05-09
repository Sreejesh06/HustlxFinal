import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
              Transform Your Skills Into Income Opportunities
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              SkillBloom helps homemakers identify their talents, showcase them to the world, and connect with earning opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                size="lg"
                onClick={() => setLocation("/register")}
              >
                Get Started For Free
              </Button>
              <Button 
                variant="outline" 
                className="text-secondary border-secondary hover:bg-secondary hover:text-white"
                size="lg"
                onClick={() => setLocation("/success-stories")}
              >
                See Success Stories
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600" 
              alt="Woman showcasing handmade pottery" 
              className="rounded-xl shadow-lg" 
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12 bg-white rounded-xl shadow-sm my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">How SkillBloom Works</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Our AI-powered platform guides you from hidden talent to thriving business in four simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div className="text-center">
            <div className="bg-primary-light bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-lightbulb-flash-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Your Skills</h3>
            <p className="text-neutral-600">
              Our AI helps identify your marketable talents from your experiences and interests.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-light bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-profile-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Your Profile</h3>
            <p className="text-neutral-600">
              Create a professional showcase for your talents with guided steps.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-light bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-store-2-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">List Your Services</h3>
            <p className="text-neutral-600">
              Offer your skills on our marketplace with AI-assisted pricing and descriptions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-light bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-line-chart-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
            <p className="text-neutral-600">
              Connect with clients, get mentorship, and access resources to scale up.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Success Stories */}
      <section className="py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-3xl font-bold text-neutral-800">Featured Success Stories</h2>
          <Button 
            variant="link"
            className="text-secondary hover:text-secondary-dark"
            onClick={() => setLocation("/success-stories")}
          >
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Success story - pottery business"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                    alt="Maya profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">Maya Wilson</h3>
                  <p className="text-sm text-neutral-600">Ceramic Artist</p>
                </div>
              </div>
              <h3 className="font-headings font-semibold text-neutral-800 mb-2">
                "From Hobby to $4,500/month Business"
              </h3>
              <p className="text-sm text-neutral-700 mb-3">
                After 15 years as a stay-at-home mom, I turned my pottery hobby into a thriving business with SkillBloom's mentorship and marketplace.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Home Studio</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">E-commerce</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Workshops</span>
              </div>
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark p-0 h-auto"
              >
                Read full story <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Success story - cooking classes"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                    alt="Priya profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">Priya Sharma</h3>
                  <p className="text-sm text-neutral-600">Culinary Instructor</p>
                </div>
              </div>
              <h3 className="font-headings font-semibold text-neutral-800 mb-2">
                "From Family Recipes to Teaching Career"
              </h3>
              <p className="text-sm text-neutral-700 mb-3">
                I never thought my family recipes would become my career. Now I teach authentic Indian cooking online and in-person to students worldwide.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Cooking Classes</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Online Courses</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Recipe Books</span>
              </div>
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark p-0 h-auto"
              >
                Read full story <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://pixabay.com/get/g71514d3e53d5791353ed4430cd18de903fbd72954733b23c50813e9eb8e0711470e2a40a96d86ba07e1713f142cdda7b0e52c736a1ae2e9df8a95628e8221ba4_1280.jpg"
                alt="Success story - home organization"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                    alt="Nicole profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">Nicole Taylor</h3>
                  <p className="text-sm text-neutral-600">Home Organization Expert</p>
                </div>
              </div>
              <h3 className="font-headings font-semibold text-neutral-800 mb-2">
                "Built a 6-Figure Organization Business"
              </h3>
              <p className="text-sm text-neutral-700 mb-3">
                After organizing my home, neighbors asked for help. SkillBloom helped me turn this into a business that now employs three other moms.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Professional Service</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Team Building</span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Micro-Loan</span>
              </div>
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark p-0 h-auto"
              >
                Read full story <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-10">
          <Button 
            className="bg-primary hover:bg-primary-dark text-white"
            size="lg"
            onClick={() => setLocation("/register")}
          >
            Start Your Success Story
          </Button>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-white rounded-xl shadow-sm my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Powerful Features to Help You Succeed</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Our AI-powered platform offers everything you need to turn your skills into income.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-ai-generate text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Skill Matching</h3>
            <p className="text-neutral-600">
              Our intelligent algorithm identifies your most marketable skills and matches them with opportunities.
            </p>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-store-2-line text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketplace Integration</h3>
            <p className="text-neutral-600">
              List your services or products and connect with customers seeking your specific talents.
            </p>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-user-star-line text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mentor Matching</h3>
            <p className="text-neutral-600">
              Get paired with successful entrepreneurs who can guide you through growing your business.
            </p>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-line-chart-line text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Growth Insights</h3>
            <p className="text-neutral-600">
              Get personalized recommendations to expand your business based on your performance data.
            </p>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-coin-line text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Funding Options</h3>
            <p className="text-neutral-600">
              Access micro-loan opportunities and financial resources tailored to your business needs.
            </p>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="bg-accent bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-community-line text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Supportive Community</h3>
            <p className="text-neutral-600">
              Connect with other homemakers who are turning their skills into successful businesses.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary rounded-xl text-white text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Skills Into Income?</h2>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Join thousands of homemakers who have discovered their potential and built successful businesses with SkillBloom.
        </p>
        <Button 
          className="bg-white text-primary hover:bg-neutral-100"
          size="lg"
          onClick={() => setLocation("/register")}
        >
          Get Started For Free
        </Button>
      </section>
    </div>
  );
}
