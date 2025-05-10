import { Link } from "wouter";
import { Check, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const SkillAssessment = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-light to-primary rounded-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row">
            <div className="md:w-1/2 text-white mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold font-heading mb-6">Start Your Skill Assessment Today</h2>
              <p className="mb-6 opacity-90">
                Our AI-powered assessment process is quick, fair, and designed to showcase your unique talents to potential customers.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mt-1 mr-3">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload Media Samples</h4>
                    <p className="text-sm opacity-90">Share videos, images, or audio of your work for AI analysis.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mt-1 mr-3">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Answer Skill-Specific Questions</h4>
                    <p className="text-sm opacity-90">Demonstrate your knowledge through our interactive Q&A system.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mt-1 mr-3">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Receive Detailed Feedback</h4>
                    <p className="text-sm opacity-90">Get personalized insights on your strengths and areas for growth.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mt-1 mr-3">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Earn Verified Skill Badges</h4>
                    <p className="text-sm opacity-90">Display your credentials prominently on your profile.</p>
                  </div>
                </div>
              </div>
              
              <Link href="/skill-verification">
                <Button variant="outline" className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition duration-200">
                  Begin Assessment
                </Button>
              </Link>
            </div>
            
            <div className="md:w-1/2">
              {/* Skill assessment form mock */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold font-heading text-gray-800 mb-6">Skill Assessment</h3>
                
                {/* Progress steps */}
                <div className="flex justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full step-active flex items-center justify-center mb-2">1</div>
                    <span className="text-xs text-gray-600">Basic Info</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 self-center relative">
                    <div className="absolute inset-0 bg-primary" style={{width: '100%'}}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full step-active flex items-center justify-center mb-2">2</div>
                    <span className="text-xs text-gray-600">Upload</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 self-center"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full step-inactive flex items-center justify-center mb-2">3</div>
                    <span className="text-xs text-gray-600">Q&A</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 self-center"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full step-inactive flex items-center justify-center mb-2">4</div>
                    <span className="text-xs text-gray-600">Results</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Samples of Your Work</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload a video showcasing your skills</p>
                      <span className="text-xs text-gray-400 mt-1 block">MP4, MOV or AVI (max. 100MB)</span>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                      <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload images of your work</p>
                      <span className="text-xs text-gray-400 mt-1 block">JPG, PNG or WEBP (max. 20MB total)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">
                    Back
                  </Button>
                  <Button className="flex-1 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                    Continue to Q&A
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillAssessment;
