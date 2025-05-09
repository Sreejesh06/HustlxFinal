// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImage?: string;
  profileCompletionPercentage?: number;
  isVerified?: boolean;
}

// Skill types
export interface Skill {
  id: number;
  userId: number;
  name: string;
  description?: string;
  confidenceLevel?: number;
  isAiSuggested?: boolean;
}

// Listing types
export interface Listing {
  id: number;
  userId: number;
  title: string;
  description: string;
  price: string;
  image?: string;
  category: string;
  tags?: string[];
  status: string;
  createdAt: Date;
}

// Mentor types
export interface Mentor {
  id: number;
  userId?: number | null;
  name: string;
  specialty: string;
  bio: string;
  image?: string;
  rating?: number;
  menteeCount?: number;
  sessionPrice?: number;
  matchPercentage?: number;
  matchReason?: string;
}

// Success Story types
export interface SuccessStory {
  id: number;
  userId?: number | null;
  name: string;
  title: string;
  content: string;
  image?: string;
  businessType: string;
  tags?: string[];
}

// Skill Suggestion types
export interface SkillSuggestion {
  id: number;
  userId: number;
  name: string;
  description: string;
  matchPercentage: number;
  tags: string[];
  icon?: string;
}

// Assessment Response types
export interface AssessmentResponse {
  id: number;
  userId: number;
  responses: Record<string, any>;
  completed: boolean;
  createdAt: Date;
}
