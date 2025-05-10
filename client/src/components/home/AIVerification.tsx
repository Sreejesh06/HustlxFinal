import { Link } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AIVerification = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl font-bold font-heading mb-6">AI-Powered Skill Verification</h2>
            <p className="text-gray-600 mb-6">Our advanced AI technology evaluates your skills through:</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Video Submissions</h4>
                  <p className="text-gray-600">Upload videos showcasing your craft, teaching style, or service quality.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Audio Analysis</h4>
                  <p className="text-gray-600">For music, language teaching, or other audio-based skills.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Image Portfolio</h4>
                  <p className="text-gray-600">Showcase your crafts, cooking, design work, and other visual skills.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Q&A Assessment</h4>
                  <p className="text-gray-600">Answer field-specific questions to demonstrate your knowledge.</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-8">
              <Link href="/skill-verification">
                <Button className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition duration-200">
                  Start Your Verification
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <Card className="bg-white rounded-xl shadow-lg p-6 relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="AI skill verification process" 
                className="w-full h-auto rounded-lg mb-6" 
              />
              
              <div className="grid grid-cols-4 gap-4">
                <div className="skill-badge bg-primary-light bg-opacity-10 p-3 rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center text-white">
                    <i className="ri-cake-3-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold text-primary">Baking</span>
                  <div className="text-xs text-gray-500 mt-1">Level 4</div>
                </div>
                
                <div className="skill-badge bg-secondary bg-opacity-10 p-3 rounded-lg text-center">
                  <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center text-white">
                    <i className="ri-palette-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold text-secondary">Crafting</span>
                  <div className="text-xs text-gray-500 mt-1">Level 3</div>
                </div>
                
                <div className="skill-badge bg-accent bg-opacity-10 p-3 rounded-lg text-center">
                  <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-2 flex items-center justify-center text-white">
                    <i className="ri-scissors-cut-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold text-accent">Sewing</span>
                  <div className="text-xs text-gray-500 mt-1">Level 5</div>
                </div>
                
                <div className="skill-badge bg-info bg-opacity-10 p-3 rounded-lg text-center">
                  <div className="w-12 h-12 bg-info rounded-full mx-auto mb-2 flex items-center justify-center text-white">
                    <i className="ri-book-open-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold text-info">Tutoring</span>
                  <div className="text-xs text-gray-500 mt-1">Level 3</div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                AI VERIFIED
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIVerification;
