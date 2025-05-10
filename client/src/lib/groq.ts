import { apiRequest } from "./queryClient";

interface SkillVerificationRequest {
  skillId: number;
  answers: Record<string, string>;
}

interface SkillVerificationResponse {
  skill: {
    id: number;
    homemakerId: number;
    category: string;
    name: string;
    level: number;
    isVerified: boolean;
    verificationDate: string;
    verificationDetails: {
      verifiedAt: string;
      skillLevel: number;
      feedback: string;
      score: number;
    };
  };
  verificationDetails: {
    verifiedAt: string;
    skillLevel: number;
    feedback: string;
    score: number;
  };
}

export async function verifySkill(
  data: SkillVerificationRequest
): Promise<SkillVerificationResponse> {
  const response = await apiRequest("POST", "/api/skills/verify", data);
  return response.json();
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "text" | "multiple_choice";
  options?: string[];
}

// Generate skill assessment questions based on skill category
export function getSkillAssessmentQuestions(
  category: string
): AssessmentQuestion[] {
  // These would typically come from an API, but for demo purposes we'll hard-code them
  
  const commonQuestions = [
    {
      id: "experience",
      question: "How many years of experience do you have with this skill?",
      type: "text" as const,
    },
    {
      id: "education",
      question: "Have you had any formal education or training in this area?",
      type: "text" as const,
    }
  ];
  
  switch (category.toLowerCase()) {
    case "cooking":
    case "baking":
      return [
        ...commonQuestions,
        {
          id: "techniques",
          question: "Which cooking techniques are you most confident with?",
          type: "text" as const,
        },
        {
          id: "specialty",
          question: "What is your specialty dish or baked good?",
          type: "text" as const,
        },
        {
          id: "dietary",
          question: "Are you experienced with any dietary restrictions (vegan, gluten-free, etc.)?",
          type: "text" as const,
        }
      ];
    
    case "crafts":
    case "handmade":
      return [
        ...commonQuestions,
        {
          id: "materials",
          question: "What materials do you primarily work with?",
          type: "text" as const,
        },
        {
          id: "tools",
          question: "What specialized tools do you use in your craft?",
          type: "text" as const,
        },
        {
          id: "process",
          question: "Briefly describe your creative process from idea to finished product.",
          type: "text" as const,
        }
      ];
    
    case "tutoring":
    case "teaching":
      return [
        ...commonQuestions,
        {
          id: "subjects",
          question: "Which subjects do you teach?",
          type: "text" as const,
        },
        {
          id: "age_groups",
          question: "Which age groups do you have experience teaching?",
          type: "multiple_choice" as const,
          options: ["Young children (5-8)", "Pre-teens (9-12)", "Teenagers (13-17)", "Adults (18+)"]
        },
        {
          id: "methodology",
          question: "Briefly describe your teaching methodology.",
          type: "text" as const,
        }
      ];
    
    default:
      return [
        ...commonQuestions,
        {
          id: "proficiency",
          question: "How would you rate your proficiency in this skill?",
          type: "multiple_choice" as const,
          options: ["Beginner", "Intermediate", "Advanced", "Expert"]
        },
        {
          id: "description",
          question: "Please describe your skill in detail.",
          type: "text" as const,
        },
        {
          id: "examples",
          question: "Can you provide examples of your work or projects?",
          type: "text" as const,
        }
      ];
  }
}
