import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// GitHub AI Model settings
const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim();
const MODEL_ENDPOINT = process.env.MODEL_ENDPOINT?.trim() || 'https://models.github.ai/inference';
const MODEL_NAME = process.env.MODEL_NAME?.trim() || 'deepseek/DeepSeek-V3-0324';

// System prompt context that guides the AI's response
const SYSTEM_CONTEXT = `You are a professional website designer and content creator who creates beautiful, dynamic websites based on user prompts. 

Deeply analyze the user's prompt to understand:
1. The industry or business type
2. The target audience
3. The brand voice (formal, casual, playful, etc.)
4. Key features or services that should be highlighted
5. Any specific design preferences mentioned

For each prompt, create a UNIQUE and DISTINCTIVE style that best matches the business type, audience, and purpose. Your design choices should vary significantly between different prompts:
- For creative businesses: Consider vibrant colors, playful layouts, and artistic elements
- For professional services: Use sophisticated color schemes, clean layouts, and elegant typography
- For tech companies: Implement modern, minimalist design with innovative elements
- For food/hospitality: Design warm, inviting visuals with appetizing color schemes
- For health/wellness: Create calming, fresh designs with natural color palettes

Generate a complete, customized website structure with rich, relevant content tailored to the prompt.

Provide the content in JSON format with the following structure:
{
  "title": "A catchy, SEO-friendly title relevant to the business",
  "description": "A compelling meta description that summarizes the value proposition",
  "theme": {
    "primaryColor": "A hex color code that fits the brand (e.g. #3b82f6)",
    "secondaryColor": "A complementary hex color code (e.g. #1e3a8a)",
    "fontFamily": "An appropriate font choice (e.g. 'Inter', 'Playfair Display', etc.)",
    "style": "The design style (e.g. 'modern', 'minimalist', 'bold', 'elegant', 'playful', etc.)"
  },
  "sections": [
    {
      "type": "hero",
      "layout": "One of: centered, split, fullscreen, video-background, etc.",
      "heading": "An attention-grabbing headline that reflects the core value proposition",
      "subheading": "A supporting statement that explains benefits",
      "cta": "Clear call to action text",
      "image": "A description of the ideal hero image"
    },
    {
      "type": "features",
      "layout": "One of: grid, cards, timeline, alternating, etc.",
      "heading": "A heading that introduces the features or services",
      "subheading": "Optional subheading text",
      "items": [
        {
          "title": "A specific feature/service title relevant to the business",
          "description": "A detailed description explaining the value of this feature",
          "icon": "A relevant icon name",
          "image": "Optional image description for this feature"
        },
        {
          "title": "Another feature/service title",
          "description": "A detailed description",
          "icon": "A relevant icon name",
          "image": "Optional image description"
        },
        {
          "title": "A third feature/service title",
          "description": "A detailed description",
          "icon": "A relevant icon name",
          "image": "Optional image description"
        }
      ]
    },
    {
      "type": "about",
      "layout": "One of: text-only, image-left, image-right, etc.",
      "heading": "About heading relevant to the business or brand",
      "content": "A detailed, compelling story about the business, its origins, mission, and values",
      "image": "Description of an appropriate image"
    }
  ]
}

You can include additional section types as appropriate for the specific business:

- "testimonials": For customer reviews
- "pricing": For pricing tables
- "team": To showcase team members
- "gallery": For image-focused businesses like photography or interior design
- "contact": Contact information and form
- "faq": Frequently asked questions
- "cta-banner": A call to action banner

Each section should have detailed, high-quality content that feels authentic to the business type. Use specific language that would appeal to the target audience.`;

// Additional style guidance to emphasize variations
const STYLE_GUIDANCE = `
IMPORTANT: For each website, create a UNIQUE visual style that fits the specific business and target audience:

1. COLOR SCHEMES: Select colors that evoke appropriate emotions and associations:
   - For tech: Blues, purples, or teals for innovation and trust
   - For food/restaurants: Warm reds, oranges, earthy tones, or fresh greens
   - For wellness/fitness: Energetic blues, calming greens, or motivational oranges
   - For luxury/premium: Rich golds, deep blues, elegant blacks, or sophisticated purples
   - For creative industries: Vibrant, bold color combinations or artistic palettes

2. TYPOGRAPHY: Choose fonts that enhance the brand personality:
   - Professional services: Clean sans-serifs like "Inter" or "Open Sans"
   - Creative/artistic: Distinctive fonts like "Playfair Display" or "Abril Fatface" 
   - Modern tech: Geometric sans-serifs like "Montserrat" or "SF Pro Display"
   - Traditional/elegant: Serif fonts like "Garamond" or "Libre Baskerville"
   - Friendly/approachable: Rounded fonts like "Quicksand" or "Nunito"

3. LAYOUT STYLES: Vary the layout based on the industry and purpose:
   - E-commerce/product-focused: Grid-based with prominent imagery
   - Portfolio/creative: Asymmetrical, unique layouts with visual focus
   - Corporate/professional: Clean, structured layouts with clear hierarchy
   - Hospitality/experience: Immersive layouts with full-width imagery
   - Educational/informational: Content-focused layouts with clear sections

4. VISUAL ELEMENTS: Recommend appropriate design accents:
   - Tech: Abstract geometric shapes, gradient overlays, minimal icons
   - Food/hospitality: Organic shapes, texture backgrounds, appetizing imagery
   - Wellness/fitness: Active imagery, progress indicators, motivational elements
   - Luxury: Subtle textures, elegant spacing, refined details
   - Creative: Artistic elements, playful components, unique interactions
`;

// Combine system context with style guidance
const ENHANCED_SYSTEM_CONTEXT = SYSTEM_CONTEXT + "\n\n" + STYLE_GUIDANCE;

// No mock responses - we're using OpenAI exclusively

export async function POST(request: NextRequest) {
  try {
    // Get prompt and style hints from request body
    const { prompt, styleHints } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }
    
    console.log('Received style hints:', styleHints);

    // Check if GitHub token is provided - this is now mandatory
    if (!GITHUB_TOKEN) {
      console.error('GitHub token is not configured');
      return NextResponse.json({ 
        error: 'GitHub token is not configured. Please set the GITHUB_TOKEN environment variable in your .env.local file.'
      }, { status: 400 });
    }

    // Initialize GitHub AI model client
    const client = ModelClient(
      MODEL_ENDPOINT,
      new AzureKeyCredential(GITHUB_TOKEN)
    );

    // Prepare the request with style guidance if available
    let userMessage = prompt;
    
    // Add style hints to the prompt if available
    if (styleHints) {
      userMessage += `\n\nStyle guidance: `;
      
      if (styleHints.industry) {
        userMessage += `Industry: ${styleHints.industry}. `;
      }
      
      if (styleHints.style) {
        userMessage += `Style preference: ${styleHints.style}. `;
      }
      
      if (styleHints.colorPreferences && styleHints.colorPreferences.length > 0) {
        userMessage += `Color preferences: ${styleHints.colorPreferences.join(', ')}. `;
      }
    }
    
    console.log('Enhanced user message:', userMessage);
    
    // Make request to GitHub AI model with the enhanced prompt
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: ENHANCED_SYSTEM_CONTEXT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.8,
        top_p: 1.0,
        max_tokens: 4096,
        model: MODEL_NAME
      }
    });

    if (isUnexpected(response)) {
      console.error('Error from GitHub AI model:', JSON.stringify(response.body, null, 2));
      console.error('Response status type:', typeof response.status);
      console.error('Response status value:', response.status);
      
      // Handle authentication errors - using string comparison for safety
      if (String(response.status) === '401' || String(response.status) === '403' || 
          JSON.stringify(response.body).includes('Unauthorized') || 
          JSON.stringify(response.body).includes('authentication')) {
        throw new Error('GitHub authentication failed: Please check that your GitHub token is valid and has the necessary permissions.');
      } 
      // Handle general errors
      else {
        const errorDetails = JSON.stringify(response.body);
        throw new Error(`GitHub AI model error (${response.status}): ${errorDetails}`);
      }
    }

    let content = response.body.choices[0].message.content || '';
    
    // Preprocess content to handle Markdown code blocks
    // Extract JSON from markdown code blocks if present
    const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
    const match = content.match(jsonRegex);
    
    if (match && match[1]) {
      console.log('Extracted JSON from markdown code block');
      content = match[1].trim();
    }
    
    // Parse the content to ensure it's valid JSON
    let parsedContent;
    try {
      // First, try to clean up any JavaScript comments that aren't valid in JSON
      const cleanedContent = content
        // Remove single line comments (// comment)
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments (/* comment */)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove trailing commas in arrays and objects
        .replace(/,(\s*[\]}])/g, '$1');
      
      console.log('Cleaned content for JSON parsing:', cleanedContent);
      
      try {
        // Try to parse the cleaned content
        parsedContent = JSON.parse(cleanedContent || '{}');
      } catch (innerError) {
        console.error('First parse attempt failed, trying more aggressive cleaning:', innerError);
        
        // If regular cleaning didn't work, try a more aggressive approach
        // Use regex to extract what looks like valid JSON properties
        const extractedProps: Record<string, unknown> = {};
        
        // Extract the title
        const titleMatch = cleanedContent.match(/"title"\s*:\s*"([^"]*)"/);
        if (titleMatch && titleMatch[1]) extractedProps.title = titleMatch[1];
        
        // Extract the description
        const descMatch = cleanedContent.match(/"description"\s*:\s*"([^"]*)"/);
        if (descMatch && descMatch[1]) extractedProps.description = descMatch[1];
        
        // Extract theme colors
        const themeProps: Record<string, unknown> = {};
        const primaryColorMatch = cleanedContent.match(/"primaryColor"\s*:\s*"([^"]*)"/);
        if (primaryColorMatch && primaryColorMatch[1]) themeProps.primaryColor = primaryColorMatch[1];
        
        const secondaryColorMatch = cleanedContent.match(/"secondaryColor"\s*:\s*"([^"]*)"/);
        if (secondaryColorMatch && secondaryColorMatch[1]) themeProps.secondaryColor = secondaryColorMatch[1];
        
        const fontFamilyMatch = cleanedContent.match(/"fontFamily"\s*:\s*"([^"]*)"/);
        if (fontFamilyMatch && fontFamilyMatch[1]) themeProps.fontFamily = fontFamilyMatch[1];
        
        const styleMatch = cleanedContent.match(/"style"\s*:\s*"([^"]*)"/);
        if (styleMatch && styleMatch[1]) themeProps.style = styleMatch[1];
        
        if (Object.keys(themeProps).length > 0) {
          extractedProps.theme = themeProps;
        }
        
        // Create a fallback object with what we could extract
        parsedContent = {
          title: extractedProps.title || "Untitled Website",
          description: extractedProps.description || "Description not available",
          theme: extractedProps.theme || {
            primaryColor: "#000000", // Default to black
            secondaryColor: "#FFFFFF", // Default to white
            fontFamily: "sans-serif", // Generic font family
            style: "default" // Neutral style
          },
          sections: extractedProps.sections || [
            {
              type: "placeholder",
              layout: "default",
              heading: "Content not available",
              subheading: "Please provide more details",
              cta: "Learn More"
            }
          ]
        };
        console.log('Using fallback content structure:', parsedContent);
      }
    } catch (error) {
      console.error('Failed to parse GitHub AI model response as JSON:', error);
      return NextResponse.json({ 
        error: 'Invalid response format from model',
        rawContent: content 
      }, { status: 500 });
    }

    // Return the generated content
    return NextResponse.json({ 
      success: true,
      content: parsedContent,
    });
    
  } catch (error) {
    console.error('Error generating website:', error);
    
    // Handle different types of errors with more specific messages
    let errorMessage = 'Failed to generate website content';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    
    // Check for specific error types
    if (error instanceof Error) {
      if (errorDetails.includes('ECONNREFUSED') || 
          errorDetails.includes('ENOTFOUND') || 
          errorDetails.includes('ETIMEDOUT') ||
          errorDetails.includes('fetch failed') ||
          errorDetails.includes('Connection') ||
          errorDetails.includes('network')) {
        errorMessage = 'Connection to GitHub AI model failed';
        errorDetails = 'Please check your internet connection and try again. If the problem persists, the model service may be temporarily unavailable.';
        statusCode = 503; // Service Unavailable
      } else if (errorDetails.includes('401') || errorDetails.includes('Unauthorized') || errorDetails.includes('Bad credentials')) {
        errorMessage = 'GitHub AI model authentication failed';
        errorDetails = 'Your GitHub token may be invalid or expired. Please check your token in the .env.local file.';
        statusCode = 401; // Unauthorized
      } else if (errorDetails.includes('429') || errorDetails.includes('Rate limit')) {
        errorMessage = 'GitHub AI model rate limit exceeded';
        errorDetails = 'You have reached your rate limit for the GitHub AI API. Please try again later.';
        statusCode = 429; // Too Many Requests
      } else if (errorDetails.includes('quota') || errorDetails.includes('insufficient_quota')) {
        errorMessage = 'GitHub AI model quota exceeded';
        errorDetails = 'Your GitHub token has insufficient quota or permissions. Please check your token permissions.';
        statusCode = 402; // Payment Required
      } else if (errorDetails.includes('timeout') || errorDetails.includes('timed out')) {
        errorMessage = 'GitHub AI model request timed out';
        errorDetails = 'The request took too long to complete. Please try again or use a simpler prompt.';
        statusCode = 504; // Gateway Timeout
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: statusCode });
  }
}
