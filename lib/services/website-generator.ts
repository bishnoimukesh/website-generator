import { WebsiteContent } from '../types';

/**
 * Generates a website based on the provided prompt
 * @param prompt The user's website description prompt
 * @returns The generated website content
 */
/**
 * Makes a fetch request with automatic retries for specific error types
 */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, retryDelay = 1000): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Check for rate limiting (HTTP 429) and retry
      if (response.status === 429) {
        console.log(`Request attempt ${attempt + 1} received rate limit response (HTTP 429)`);
        
        if (attempt < maxRetries - 1) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.log(`Request attempt ${attempt + 1} failed:`, lastError.message);
      
      // Only retry on connection/network errors, not on other types of errors
      const isNetworkError = 
        lastError.message.includes('fetch') || 
        lastError.message.includes('network') || 
        lastError.message === 'Failed to fetch' ||
        lastError.message.includes('ECONNREFUSED') ||
        lastError.message.includes('ETIMEDOUT');
        
      if (!isNetworkError) {
        throw lastError;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Request failed after multiple attempts');
}

export async function generateWebsite(prompt: string): Promise<WebsiteContent> {
  try {
    console.log('Sending request to /api/generate with prompt:', prompt);
    
    // Preprocess the prompt to extract style hints
    const styleHints = analyzePromptForStyleHints(prompt);
    
    // Use fetchWithRetry instead of regular fetch for better handling of network issues
    const response = await fetchWithRetry('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt,
        styleHints 
      }),
    }, 3, 1000); // 3 retries with 1 second initial delay
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error response:', data);
      
      // Handle specific error types for better user feedback
      if (data.error) {
        // GitHub token issues
        if (data.error.includes('GitHub token') || data.error.includes('authentication') || data.error.includes('Bad credentials')) {
          throw new Error(`GitHub token issue: ${data.error}. Please add your GitHub token in the .env.local file.`);
        }
        // Connection errors
        else if (data.error.includes('Connection') || data.details?.includes('Connection')) {
          throw new Error(`Connection error: Unable to reach GitHub AI model. Please check your internet connection and try again.`);
        }
        // Rate limiting
        else if (data.error.includes('rate limit') || data.error.includes('429')) {
          throw new Error(`GitHub AI rate limit reached. Please try again after some time.`);
        }
        // Quota/permission issues
        else if (data.error.includes('quota') || data.error.includes('permissions') || data.details?.includes('quota')) {
          throw new Error(`GitHub AI quota exceeded: Your token may have insufficient permissions or quota. Please check your token settings.`);
        }
        // Timeout errors
        else if (data.error.includes('timeout') || data.details?.includes('timeout')) {
          throw new Error(`The request timed out. Please try a simpler prompt or try again later.`);
        }
        // Generic error with detailed message if available
        else {
          throw new Error(`${data.error}${data.details ? `: ${data.details}` : ''}`);
        }
      }
      
      throw new Error(data.details || 'Failed to generate website');
    }
    
    if (!data.content) {
      console.error('Missing content in response:', data);
      throw new Error('No content received from the API');
    }
    
    // Validate the structure of the content
    if (!validateWebsiteContent(data.content)) {
      throw new Error('The generated content is incomplete or invalid. Please try again with a more specific prompt.');
    }
    
    console.log('Received website content:', data.content);
    return data.content;
  } catch (error) {
    console.error('Error in generateWebsite:', error);
    
    // Handle fetch/network errors that might not be caught by the API
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network') || error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
        throw new Error('Request timed out. The server took too long to respond. Please try again later.');
      }
    }
    
    // Re-throw the error with any additional context we've added
    throw error;
  }
}

/**
 * Saves website content to localStorage for preview
 * @param content The website content object
 * @returns The ID of the saved content
 */
export function saveWebsiteContent(content: WebsiteContent): string {
  // In a real app, you'd store this in a database and get a real ID
  // For now, we'll use a timestamp as ID and store in localStorage
  const id = Date.now().toString();
  localStorage.setItem('generatedWebsiteContent', JSON.stringify(content));
  return id;
}

/**
 * Analyze the prompt to extract style hints for the website generation
 * @param prompt The user's website description prompt
 * @returns Style hints extracted from the prompt
 */
function analyzePromptForStyleHints(prompt: string): { 
  industry?: string; 
  style?: string; 
  colorPreferences?: string[];
} {
  const promptLower = prompt.toLowerCase();
  
  // Business/Industry Type Detection
  const industries = [
    { name: 'coffee', keywords: ['coffee', 'cafe', 'barista', 'espresso'] },
    { name: 'tech', keywords: ['tech', 'software', 'app', 'digital', 'technology', 'ai', 'artificial intelligence', 'coding'] },
    { name: 'fitness', keywords: ['fitness', 'gym', 'workout', 'health', 'exercise', 'wellness', 'training'] },
    { name: 'food', keywords: ['restaurant', 'food', 'bakery', 'catering', 'cuisine', 'dining', 'eatery'] },
    { name: 'education', keywords: ['school', 'education', 'training', 'course', 'learning', 'teaching', 'academy'] },
    { name: 'realestate', keywords: ['real estate', 'property', 'home', 'apartment', 'housing', 'realtor', 'broker'] },
    { name: 'art', keywords: ['art', 'gallery', 'creative', 'design', 'artist', 'exhibition', 'studio'] },
    { name: 'fashion', keywords: ['fashion', 'clothing', 'style', 'apparel', 'boutique', 'designer', 'wear'] },
    { name: 'travel', keywords: ['travel', 'tourism', 'vacation', 'hotel', 'adventure', 'destination', 'tour'] },
    { name: 'beauty', keywords: ['beauty', 'salon', 'spa', 'cosmetics', 'makeup', 'skincare', 'hairstyling'] }
  ];
  
  // Style Preferences
  const styles = [
    { name: 'modern', keywords: ['modern', 'sleek', 'contemporary', 'current', 'trendy'] },
    { name: 'minimal', keywords: ['minimal', 'clean', 'simple', 'minimalist', 'uncluttered', 'zen'] },
    { name: 'playful', keywords: ['fun', 'playful', 'creative', 'colorful', 'vibrant', 'cheerful'] },
    { name: 'luxury', keywords: ['luxury', 'premium', 'high-end', 'elegant', 'sophisticated', 'exclusive'] },
    { name: 'retro', keywords: ['retro', 'vintage', 'classic', 'nostalgic', 'old-school', 'throwback'] },
    { name: 'bold', keywords: ['bold', 'striking', 'dramatic', 'vibrant', 'eye-catching', 'dynamic'] },
    { name: 'dark', keywords: ['dark', 'black', 'night', 'moody', 'gothic'] },
    { name: 'light', keywords: ['light', 'bright', 'white', 'airy', 'clean'] }
  ];
  
  // Color Preferences
  const colorMatches = promptLower.match(/(?:color|colours?|theme)s?:?\s*([a-z\s,]+)/i);
  let colorPreferences: string[] = [];
  
  if (colorMatches && colorMatches[1]) {
    colorPreferences = colorMatches[1]
      .split(/[,\s]+/)
      .filter(color => ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'gray', 'grey', 'brown', 'teal', 'navy', 'gold', 'silver'].includes(color));
  }
  
  // Find matching industry
  const matchedIndustry = industries.find(industry => 
    industry.keywords.some(keyword => promptLower.includes(keyword))
  );
  
  // Find matching style
  const matchedStyle = styles.find(style => 
    style.keywords.some(keyword => promptLower.includes(keyword))
  );
  
  return {
    industry: matchedIndustry?.name,
    style: matchedStyle?.name,
    colorPreferences: colorPreferences.length > 0 ? colorPreferences : undefined
  };
}

/**
 * Validates the structure of website content received from the API
 * @param content Website content to validate
 * @returns True if the content structure is valid, false otherwise
 */
function validateWebsiteContent(content: Partial<WebsiteContent>): boolean {
  // Check if content has the required fields
  if (!content.title || !content.description || !Array.isArray(content.sections)) {
    console.error('Content is missing required fields:', content);
    return false;
  }
  
  // Check if there's at least one section
  if (content.sections.length === 0) {
    console.error('Content has no sections');
    return false;
  }
  
  // Check if each section has the minimum required fields
  for (const section of content.sections) {
    if (!section.type || !section.heading) {
      console.error('Section is missing required fields:', section);
      return false;
    }
    
    // Additional validation for specific section types
    if (section.type === 'features' && section.items && !Array.isArray(section.items)) {
      console.error('Features section has invalid items:', section.items);
      return false;
    }
    
    if (section.type === 'testimonials' && section.testimonials && !Array.isArray(section.testimonials)) {
      console.error('Testimonials section has invalid testimonials array:', section.testimonials);
      return false;
    }
    
    if (section.type === 'pricing' && section.plans && !Array.isArray(section.plans)) {
      console.error('Pricing section has invalid plans array:', section.plans);
      return false;
    }
  }
  
  // Check for theme information
  if (content.theme) {
    const { theme } = content;
    // Ensure color codes are valid hex codes if provided
    if (theme.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(theme.primaryColor)) {
      console.warn('Invalid primary color format:', theme.primaryColor);
      // Don't return false, just warn - not critical
    }
  }
  
  return true;
}
