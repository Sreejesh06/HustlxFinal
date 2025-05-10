import { Helmet } from 'react-helmet';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample success stories data
const successStories = [
  {
    id: 1,
    name: "Rina Mathers",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "Portland, OR",
    skill: "Custom Baking",
    story: "After 15 years as a stay-at-home mom, I was anxious about entering the workforce. Hustlx helped me verify my baking skills and build a customer base. I now run a successful custom cake business from my home kitchen, earning over $3,000 monthly while maintaining flexibility for my family.",
    monthlyEarnings: "$3,200",
    yearOnPlatform: "1.5 years",
    rating: 4.9,
    reviewCount: 142,
    featured: true
  },
  {
    id: 2,
    name: "James Wilson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "Austin, TX",
    skill: "Woodworking",
    story: "After being a house-husband for 8 years, I wanted to turn my woodworking hobby into an income stream. Through Hustlx's verification process, I demonstrated my craftsmanship and now sell custom furniture pieces. The AI verification gave customers confidence in my skills despite my lack of formal training.",
    monthlyEarnings: "$4,500",
    yearOnPlatform: "2 years",
    rating: 4.8,
    reviewCount: 89,
    featured: false
  },
  {
    id: 3,
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1253&q=80",
    location: "Chicago, IL",
    skill: "Math Tutoring",
    story: "As a former math teacher who took a decade off to raise children, I was struggling to re-enter education. Hustlx allowed me to verify my teaching skills and connect with students needing math support. I now tutor 15 students weekly and earn more than I did as a full-time teacher, all while working fewer hours!",
    monthlyEarnings: "$5,800",
    yearOnPlatform: "2.5 years",
    rating: 5.0,
    reviewCount: 213,
    featured: true
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
    location: "Miami, FL",
    skill: "Personal Styling",
    story: "After years of being complimented on my fashion sense, I decided to turn it into a business. Hustlx's skill verification process helped me establish credibility as a personal stylist without expensive fashion school credentials. I now help clients build their wardrobes and style special events, and I've even been featured in local magazines!",
    monthlyEarnings: "$3,900",
    yearOnPlatform: "1 year",
    rating: 4.7,
    reviewCount: 68,
    featured: false
  },
  {
    id: 5,
    name: "Thomas Lee",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "Seattle, WA",
    skill: "Home Organization",
    story: "I spent years perfecting organization systems for my own home before joining Hustlx. After verifying my skills, I started offering home organization services to busy professionals. What started as a small side gig has grown into a profitable business with a waitlist of clients. I'm now expanding by hiring and training others!",
    monthlyEarnings: "$6,200",
    yearOnPlatform: "3 years",
    rating: 4.9,
    reviewCount: 175,
    featured: true
  },
  {
    id: 6,
    name: "Grace Kim",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1461&q=80",
    location: "San Francisco, CA",
    skill: "Digital Art",
    story: "I taught myself digital illustration while staying home with my children. Through Hustlx, I verified my skills and started creating custom portraits and illustrations for clients. The platform's AI assessment gave me the confidence to price my work appropriately, and I now have a thriving freelance career that works around my family's schedule.",
    monthlyEarnings: "$4,800",
    yearOnPlatform: "2 years",
    rating: 4.8,
    reviewCount: 92,
    featured: false
  },
];

export default function SuccessStories() {
  // Featured stories filtered from the main array
  const featuredStories = successStories.filter(story => story.featured);

  return (
    <>
      <Helmet>
        <title>Success Stories | Hustlx</title>
        <meta name="description" content="Discover how homemakers are turning their skills into thriving businesses using Hustlx's AI-powered skill verification platform." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the talented homemakers who have transformed their skills into thriving businesses using our platform.
          </p>
        </div>
        
        {/* Featured Stories Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10">Featured Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredStories.map(story => (
              <Card key={story.id} className="overflow-hidden shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={story.photo}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{story.name}</h3>
                      <p className="text-gray-500">{story.location}</p>
                    </div>
                    <Badge className="bg-primary">{story.skill}</Badge>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(story.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({story.reviewCount} reviews)</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-gray-500 text-sm">Monthly Earnings</p>
                      <p className="font-bold text-primary">{story.monthlyEarnings}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">On Platform</p>
                      <p className="font-bold">{story.yearOnPlatform}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-3 mb-4">{story.story}</p>
                  
                  <div className="text-right">
                    <a href="#" className="text-primary hover:underline font-medium">Read full story</a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Testimonial Quote Section */}
        <div className="bg-primary/5 p-8 md:p-12 rounded-2xl mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-12 w-12 text-primary/40 mx-auto mb-6" />
            <p className="text-xl md:text-2xl text-gray-700 mb-6">
              "Hustlx changed my life. After 12 years as a stay-at-home mom, I was afraid my skills wouldn't be valued in the traditional workforce. The platform's verification process gave me confidence and credibility to charge what I'm worth. I now run a successful business on my own terms."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80" 
                  alt="Julia Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold">Julia Chen</p>
                <p className="text-gray-500 text-sm">Personal Chef, San Diego</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* All Success Stories */}
        <div>
          <h2 className="text-3xl font-bold mb-10">More Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.filter(story => !story.featured).map(story => (
              <Card key={story.id} className="overflow-hidden shadow-md">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={story.photo}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{story.name}</h3>
                      <p className="text-gray-500 text-sm">{story.location}</p>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-primary text-xs">{story.skill}</Badge>
                        <span className="ml-2 text-xs text-gray-500">• {story.yearOnPlatform} on Hustlx</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{story.story}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(story.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({story.reviewCount})</span>
                    </div>
                    <p className="font-bold text-primary">{story.monthlyEarnings}<span className="text-xs text-gray-500">/mo</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}