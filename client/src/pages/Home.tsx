import { Helmet } from 'react-helmet';
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import AIVerification from "@/components/home/AIVerification";
import DualInterface from "@/components/home/DualInterface";
import FeaturedListings from "@/components/home/FeaturedListings";
import SkillAssessment from "@/components/home/SkillAssessment";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>EmpowerHer - Turn Your Skills Into Income</title>
        <meta name="description" content="EmpowerHer helps homemakers verify their skills, build a professional portfolio, and connect with customers through our AI-powered platform." />
        <meta property="og:title" content="EmpowerHer - AI-Powered Skills Marketplace" />
        <meta property="og:description" content="Transform your homemaking skills into a thriving business with our AI verification and marketplace platform." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <ScrollArea className="h-full">
        <HeroSection />
        <HowItWorks />
        <AIVerification />
        <DualInterface />
        <FeaturedListings />
        <SkillAssessment />
        <Testimonials />
        <CTA />
      </ScrollArea>
    </>
  );
}
