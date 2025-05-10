import { Helmet } from 'react-helmet';
import { Card, CardContent } from "@/components/ui/card";
import { User, HeartHandshake, TrendingUp, Globe } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Hustlx</title>
        <meta name="description" content="Learn about Hustlx's mission to empower homemakers by transforming domestic skills into marketable services through AI-powered skill verification." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Hustlx</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're on a mission to empower homemakers by transforming domestic skills into marketable services through our AI-powered platform.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Hustlx was born from a simple observation: homemakers possess incredible skills that often go unrecognized and undervalued in the traditional job market.
            </p>
            <p className="text-gray-700 mb-4">
              Our founder, Sarah Chen, witnessed her mother's struggle to find employment that valued her 20 years of homemaking expertise. Despite being an exceptional cook, seamstress, and caregiver, traditional employers overlooked her capabilities due to a "gap" in her professional resume.
            </p>
            <p className="text-gray-700">
              This inspired the creation of Hustlx - a platform that uses AI to objectively verify and validate homemaking skills, creating a bridge between talented homemakers and customers seeking quality services.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
              alt="Team collaboration" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white border-none shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                <p className="text-gray-600">
                  We believe in giving homemakers the tools and opportunities to recognize the value of their skills and transform them into income sources.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive community where homemakers can connect, share experiences, and grow together.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We use cutting-edge AI technology to objectively assess and verify skills, creating trust in the marketplace.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
                <p className="text-gray-600">
                  We're committed to creating opportunities for homemakers from all backgrounds, cultures, and communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden mx-auto h-48 w-48">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80" 
                  alt="Sarah Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Sarah Chen</h3>
              <p className="text-gray-500">Founder & CEO</p>
              <p className="text-gray-600 mt-2">
                Former management consultant passionate about creating economic opportunities for homemakers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden mx-auto h-48 w-48">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80" 
                  alt="Michael Rodriguez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Michael Rodriguez</h3>
              <p className="text-gray-500">CTO</p>
              <p className="text-gray-600 mt-2">
                AI engineer with expertise in machine learning and skill assessment algorithms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden mx-auto h-48 w-48">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1461&q=80" 
                  alt="Aisha Patel" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Aisha Patel</h3>
              <p className="text-gray-500">COO</p>
              <p className="text-gray-600 mt-2">
                Operations expert with a background in community building and marketplace platforms.
              </p>
            </div>
          </div>
        </div>
        
        {/* Mission Statement */}
        <div className="bg-primary/5 px-8 py-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            "To transform homemaking expertise into recognized professional skills, creating economic independence and empowerment for homemakers worldwide while connecting customers with exceptional service providers."
          </p>
        </div>
      </div>
    </>
  );
}