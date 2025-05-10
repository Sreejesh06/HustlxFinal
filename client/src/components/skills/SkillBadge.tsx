import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Award, Medal } from "lucide-react";

interface SkillBadgeProps {
  name: string;
  category: string;
  level: number;
  isVerified: boolean;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, JSX.Element> = {
  "cooking": <i className="ri-cake-3-line text-xl"></i>,
  "baking": <i className="ri-cake-3-line text-xl"></i>,
  "crafts": <i className="ri-palette-line text-xl"></i>,
  "handmade": <i className="ri-scissors-cut-line text-xl"></i>,
  "tutoring": <i className="ri-book-open-line text-xl"></i>,
  "teaching": <i className="ri-book-open-line text-xl"></i>,
  "beauty": <i className="ri-heart-3-line text-xl"></i>,
  "wellness": <i className="ri-heart-3-line text-xl"></i>,
  "home": <i className="ri-home-line text-xl"></i>,
  "music": <i className="ri-music-2-line text-xl"></i>,
  "language": <i className="ri-translate-2-line text-xl"></i>,
  "art": <i className="ri-paint-brush-line text-xl"></i>,
  "default": <Award className="h-5 w-5" />
};

const getIconForCategory = (category: string): JSX.Element => {
  const lowerCategory = category.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerCategory.includes(key)) {
      return icon;
    }
  }
  return iconMap.default;
};

const getColorForCategory = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("cooking") || lowerCategory.includes("baking")) {
    return "bg-primary-light bg-opacity-10 text-primary";
  }
  if (lowerCategory.includes("craft") || lowerCategory.includes("handmade") || lowerCategory.includes("art")) {
    return "bg-secondary bg-opacity-10 text-secondary";
  }
  if (lowerCategory.includes("tutor") || lowerCategory.includes("teach") || lowerCategory.includes("language")) {
    return "bg-accent bg-opacity-10 text-accent";
  }
  if (lowerCategory.includes("beauty") || lowerCategory.includes("wellness")) {
    return "bg-rose-500 bg-opacity-10 text-rose-500";
  }
  if (lowerCategory.includes("home") || lowerCategory.includes("service")) {
    return "bg-blue-500 bg-opacity-10 text-blue-500";
  }
  return "bg-gray-500 bg-opacity-10 text-gray-700";
};

const SkillBadge = ({ 
  name, 
  category, 
  level, 
  isVerified, 
  size = "md", 
  clickable = false,
  onClick 
}: SkillBadgeProps) => {
  const colorClass = getColorForCategory(category);
  const icon = getIconForCategory(category);
  
  const sizeClasses = {
    sm: "p-2 rounded-lg text-center",
    md: "p-3 rounded-lg text-center",
    lg: "p-4 rounded-lg text-center"
  };
  
  const iconSizes = {
    sm: "w-8 h-8 mb-1",
    md: "w-12 h-12 mb-2",
    lg: "w-16 h-16 mb-3"
  };
  
  const fontSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  const badgeSizes = {
    sm: "-top-2 -right-2",
    md: "-top-3 -right-3",
    lg: "-top-4 -right-4"
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`skill-badge ${colorClass} ${sizeClasses[size]} relative ${clickable ? "cursor-pointer" : ""}`}
            onClick={clickable ? onClick : undefined}
          >
            <div className={`${iconSizes[size]} rounded-full mx-auto flex items-center justify-center text-white`} style={{backgroundColor: colorClass.split("text-")[1]}}>
              {icon}
            </div>
            <span className={`${fontSizes[size]} font-semibold truncate block`} style={{color: colorClass.split("text-")[1]}}>
              {name}
            </span>
            <div className={`text-xs text-gray-500 mt-1`}>Level {level}</div>
            
            {isVerified && (
              <div className={`absolute ${badgeSizes[size]} bg-green-600 text-white text-xs font-bold px-1 py-0.5 rounded-full flex items-center`}>
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                <span className="text-[10px]">AI</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 p-1">
            <p className="font-semibold">{name} - Level {level}/5</p>
            <p className="text-xs text-gray-500">{category}</p>
            <div className="flex items-center space-x-1">
              <Progress value={(level / 5) * 100} className="h-1.5 w-20" />
              <span className="text-xs">{level}/5</span>
            </div>
            <p className="text-xs flex items-center">
              {isVerified ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                  <span>AI Verified</span>
                </>
              ) : (
                <span className="text-gray-500">Not Verified</span>
              )}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SkillBadge;
