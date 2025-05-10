import { Star, StarHalf } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  imageSrc: string;
  quote: string;
  memberSince: string;
  stats: string;
  rating: number;
}

const TestimonialCard = ({ name, role, imageSrc, quote, memberSince, stats, rating }: TestimonialProps) => {
  // Generate star ratings
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    if (halfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    // Add empty stars to make 5 stars total
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400" size={16} />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm relative">
      <div className="absolute top-6 right-6 text-5xl text-primary opacity-10 leading-none quote">"</div>
      
      <div className="flex items-center mb-4">
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-14 h-14 rounded-full object-cover mr-4" 
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
          <div className="flex text-yellow-400 text-xs mt-1">
            {renderStars()}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 quote italic mb-4">{quote}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-primary font-medium">{memberSince}</span>
        <span className="text-gray-500">{stats}</span>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophia R.",
      role: "Baking Entrepreneur",
      imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      quote: "\"I was baking cupcakes for friends and family before I found EmpowerHer. The AI assessment validated my skills, and now I run a thriving custom bakery business from home. Last month I made more than my previous full-time job!\"",
      memberSince: "Member since 2022",
      stats: "Monthly earnings: $3,200+",
      rating: 5
    },
    {
      name: "Mei L.",
      role: "Language Tutor",
      imageSrc: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      quote: "\"As a stay-at-home mom, I wanted to use my language skills but couldn't commit to a traditional job. Through EmpowerHer's platform, I now teach Mandarin online to students globally. The AI verification gave me instant credibility.\"",
      memberSince: "Member since 2021",
      stats: "Weekly classes: 15+",
      rating: 5
    },
    {
      name: "Aisha J.",
      role: "Handmade Jewelry Creator",
      imageSrc: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      quote: "\"I started making jewelry as a hobby, but wasn't sure how to turn it into a business. EmpowerHer's platform gave me the tools to showcase my work, set fair prices, and find customers. I even got a micro-loan to buy better tools!\"",
      memberSince: "Member since 2023",
      stats: "Orders completed: 156",
      rating: 4.5
    }
  ];

  return (
    <section className="py-16 bg-gray-50" id="success-stories">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from homemakers who have transformed their skills into thriving businesses on our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="text-primary hover:text-primary-dark font-medium transition flex items-center justify-center">
            <span>Read more success stories</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
