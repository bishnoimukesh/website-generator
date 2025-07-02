# AI Website Generator

A powerful Next.js application that uses AI to generate complete, customizable websites from text prompts.

## Features

- **AI-Powered Design**: Generate entire websites from simple text descriptions
- **Customizable Templates**: Choose from a variety of design options based on your industry and style preferences
- **Code Export**: Download clean, optimized code for your own hosting
- **Responsive Design**: All generated websites are fully responsive and work on all devices
- **Real-time Preview**: See your generated website in real-time before finalizing

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: React Hooks
- **API**: Server-side API routes with Next.js
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/website-generator.git
cd website-generator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables  
Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a description of the website you want to create in the prompt field (e.g., "Create a landing page for a coffee shop with a modern design")
2. Click "Generate" to create your website
3. Customize any elements as needed in the preview
4. Export the code or deploy directly to your hosting

## Project Structure

```
website-generator/
├── app/                  # Next.js app directory 
│   ├── api/              # API endpoints
│   ├── preview/          # Website preview pages
├── components/           # Reusable React components
│   ├── ui/               # UI components
├── lib/                  # Utility functions and services
│   ├── services/         # Service functions
│   └── types.ts          # TypeScript types
├── public/               # Static assets
```

## Component Library

This project uses a collection of plug-and-play components:

- **HeroPrompt**: The main AI input component for generating websites
- **FeaturesGrid**: Showcases features in a customizable grid layout
- **IconSection**: Displays features with icons in various layouts
- **HowItWorks**: Step-by-step guide component
- **ApplicationStats**: Customizable statistics display

## API Reference

### Generate Website

```
POST /api/generate
```

**Request Body**
```json
{
  "prompt": "Create a landing page for a coffee shop",
  "styleHints": {
    "industry": "coffee",
    "style": "modern",
    "colorPreferences": ["brown", "white"]
  }
}
```

**Response**
```json
{
  "content": {
    "title": "Bean Brew Coffee",
    "description": "A premium coffee experience",
    "theme": { ... },
    "sections": [ ... ]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.