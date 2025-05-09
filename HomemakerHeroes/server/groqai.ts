import OpenAI from "openai";

// Initialize OpenAI client but configured for Groq API
const groq = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY || "demo-api-key",
  baseURL: "https://api.groq.com/openai/v1"
});

// Function to generate skill suggestions based on user input
export async function generateSkillSuggestions(
  userInput: {
    interests: string[];
    experience: string[];
    hobbies: string[];
    personalityTraits: string[];
    demographics?: string;
  }
): Promise<{
  skills: Array<{
    name: string;
    description: string;
    matchPercentage: number;
    tags: string[];
    icon: string;
  }>;
}> {
  try {
    const prompt = `
      I need to suggest marketable skills for a homemaker based on their input.
      
      User information:
      - Interests: ${userInput.interests.join(', ')}
      - Experience: ${userInput.experience.join(', ')}
      - Hobbies: ${userInput.hobbies.join(', ')}
      - Personality traits: ${userInput.personalityTraits.join(', ')}
      ${userInput.demographics ? `- Demographics: ${userInput.demographics}` : ''}
      
      Generate 3 premium, high-value skill suggestions that the user could monetize. Focus on professional-sounding services with strong earning potential rather than basic household tasks. For instance, suggest "Artisanal Catering Service" instead of "cooking" or "Interior Design Consultation" instead of "home organization".
      
      For each suggestion, include:
      1. A professional-sounding skill name that implies expertise and premium value
      2. A compelling description of how they could monetize this skill for maximum income potential
      3. A match percentage (between 80-98%)
      4. Two tags relevant to the skill (focus on "premium market", "scalable business", "high earning potential", etc.)
      5. A relevant icon name from the Remix Icon set (ri-xxx-line format)
      
      Format your response as a JSON object with a 'skills' array containing these suggestions.
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",  // Using Llama3 model from Groq
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in Groq response");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating skill suggestions:", error);
    
    // Return fallback suggestions if API fails
    return {
      skills: [
        {
          name: "Gourmet Catering Service",
          description: "Launch a premium catering business for exclusive events and corporate functions with your signature culinary creations.",
          matchPercentage: 98,
          tags: ["Premium market", "High profit margin"],
          icon: "ri-restaurant-line"
        },
        {
          name: "Creative Workshop Academy",
          description: "Create a branded series of premium workshops teaching advanced crafting techniques through in-person masterclasses and digital courses.",
          matchPercentage: 92,
          tags: ["Scalable business", "Passive income potential"],
          icon: "ri-artboard-line"
        },
        {
          name: "Luxury Space Transformation",
          description: "Offer comprehensive space transformation consultations for high-end clients looking to maximize functionality and aesthetics in their homes or offices.",
          matchPercentage: 85,
          tags: ["Affluent clientele", "High-ticket service"],
          icon: "ri-layout-line"
        }
      ]
    };
  }
}

// Function to analyze assessment responses and generate skill insights
export async function analyzeAssessmentResponses(
  responses: Record<string, any>
): Promise<{
  suggestedSkills: Array<{
    name: string;
    description: string;
    matchPercentage: number;
    tags: string[];
    icon: string;
  }>;
  businessInsights: string;
}> {
  try {
    const responsesText = JSON.stringify(responses);
    
    const prompt = `
      Analyze these assessment responses from a homemaker looking to monetize their skills:
      
      ${responsesText}
      
      Based on these responses, please provide:
      1. Three suggested skills they could monetize with names, descriptions, match percentages (80-98%), tags, and icon names (in ri-xxx-line format)
      2. A brief business insight paragraph with actionable advice
      
      Format your response as a JSON object with 'suggestedSkills' array and 'businessInsights' string.
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in Groq response");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing assessment responses:", error);
    
    // Return fallback analysis if API fails
    return {
      suggestedSkills: [
        {
          name: "Artisanal Patisserie Consultancy",
          description: "Launch a premium consultation service for high-end bakeries and catering companies, sharing your unique recipes and techniques through private masterclasses.",
          matchPercentage: 94,
          tags: ["B2B opportunity", "Expert positioning"],
          icon: "ri-store-3-line"
        },
        {
          name: "Lifestyle Design Consultancy",
          description: "Provide comprehensive lifestyle transformation services for executives and high-net-worth individuals seeking optimized living environments and routines.",
          matchPercentage: 89,
          tags: ["Luxury clientele", "High-ticket service"],
          icon: "ri-layout-masonry-line"
        },
        {
          name: "Digital Crafting Academy",
          description: "Create a branded online platform offering premium workshops, certification programs, and exclusive memberships for aspiring creators in your niche.",
          matchPercentage: 85,
          tags: ["Scalable digital product", "Recurring revenue"],
          icon: "ri-movie-2-line"
        }
      ],
      businessInsights: "Consider positioning yourself in the premium segment of your market rather than competing on price. Your unique skill combination creates opportunities for exclusive service offerings that affluent clients will value. Focus on developing a strong brand identity and authoritative online presence to justify premium pricing, and consider creating tiered service packages that allow different entry points while maintaining high perceived value."
    };
  }
}

// Function to generate business growth suggestions
export async function generateBusinessSuggestions(
  userInfo: {
    skills: string[];
    currentServices: string[];
    averagePrice: number;
    salesData?: any;
  }
): Promise<{
  suggestion: string;
  potentialIncrease: string;
  actions: string[];
}> {
  try {
    const userInfoText = JSON.stringify(userInfo);
    
    const prompt = `
      Based on this information about a homemaker's business:
      
      ${userInfoText}
      
      Generate a strategic business growth suggestion including:
      1. A specific suggestion to increase revenue
      2. The potential percentage increase in revenue this could create
      3. 2-3 concrete actions they can take to implement this suggestion
      
      Format your response as a JSON object with 'suggestion', 'potentialIncrease', and 'actions' fields.
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in Groq response");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating business suggestions:", error);
    
    // Return fallback suggestions if API fails
    return {
      suggestion: "Launch a premium 'Signature Collection' product line with exclusive designs and limited availability to attract high-value clients.",
      potentialIncrease: "30-45%",
      actions: [
        "Develop 3-5 signature premium offerings with distinctive branding and premium packaging",
        "Implement tiered pricing with the signature collection positioned at 2-3x your standard rates",
        "Create an exclusive marketing campaign emphasizing limited availability and the unique value proposition of your signature offerings"
      ]
    };
  }
}

// Function to match mentors with users
export async function suggestMentors(
  userProfile: {
    skills: string[];
    interests: string[];
    goals: string[];
  },
  availableMentors: Array<{
    id: number;
    name: string;
    specialty: string;
    bio: string;
  }>
): Promise<{
  mentors: Array<{
    id: number;
    matchPercentage: number;
    matchReason: string;
  }>;
}> {
  try {
    const userProfileText = JSON.stringify(userProfile);
    const mentorsText = JSON.stringify(availableMentors);
    
    const prompt = `
      Match a homemaker with the most suitable mentors from this list.
      
      User profile:
      ${userProfileText}
      
      Available mentors:
      ${mentorsText}
      
      Suggest the top 2 mentors that would be the best fit for this user.
      For each mentor, provide their ID, a match percentage (between 70-95%), and 
      a brief explanation of why they're a good match.
      
      Format your response as a JSON object with a 'mentors' array containing these suggestions.
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in Groq response");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error suggesting mentors:", error);
    
    // Return fallback mentor matches if API fails
    return {
      mentors: availableMentors.slice(0, 2).map((mentor, index) => ({
        id: mentor.id,
        matchPercentage: index === 0 ? 94 : 85,
        matchReason: index === 0 
          ? "Specializes in your primary skill area and has extensive experience helping beginners scale their business."
          : "Has expertise in marketing and client acquisition strategies that align with your growth goals."
      }))
    };
  }
}