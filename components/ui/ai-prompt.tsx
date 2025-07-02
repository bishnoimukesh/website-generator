'use client';

import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd, Send, UploadCloud, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./textarea";
import { useState } from "react";
import { generateWebsite, saveWebsiteContent } from "@/lib/services/website-generator";
import { useRouter } from "next/navigation";

export type HeroPromptProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  logoHref?: string;
  logoText?: string;
  logoIcon?: LucideIcon;
  className?: string;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  formId?: string;
  textareaName?: string;
  defaultValue?: string;
  buttons?: {
    upload?: {
      icon?: LucideIcon;
      ariaLabel?: string;
      type?: "button" | "submit";
    };
    submit?: {
      icon?: LucideIcon;
      ariaLabel?: string;
      type?: "button" | "submit";
    };
  }
};

export const HeroPrompt = ({
  title = "Welcome to Web Builder",
  subtitle = "Your AI-powered copilot for building the web",
  placeholder = "Generate a website for my business...",
  logoHref = "#",
  logoText = "Web Builder",
  logoIcon: LogoIcon = GalleryVerticalEnd,
  className,
  formId,
  textareaName = "prompt",
  defaultValue = "",
  buttons = {
    upload: {
      icon: UploadCloud,
      ariaLabel: "Upload file",
      type: "button"
    },
    submit: {
      icon: Send,
      ariaLabel: "Submit prompt",
      type: "submit"
    }
  }
}: HeroPromptProps) => {
  const UploadIcon = buttons.upload?.icon || UploadCloud;
  const SubmitIcon = buttons.submit?.icon || Send;
  const router = useRouter();
  const [prompt, setPrompt] = useState(defaultValue);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const websiteContent = await generateWebsite(prompt);
      
      if (!websiteContent) {
        throw new Error("No content was generated. Please try again.");
      }
      
      const contentId = saveWebsiteContent(websiteContent);
      
      router.push(`/preview/${contentId}`);
    } catch (err) {
      console.error("Error generating website:", err);
      
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch") || 
            err.message.includes("network") || 
            err.message.includes("Connection error") ||
            err.message.includes("connect")) {
          setError("Network error: Unable to reach our servers. Please check your internet connection and try again.");
        } 
        else if (err.message.includes("OpenAI API key") || err.message.includes("API key") || err.message.includes("authentication")) {
          setError("OpenAI API key is missing or invalid. Please check your environment configuration in the .env.local file.");
        } 
        else if (err.message.includes("rate limit") || err.message.includes("429")) {
          setError("OpenAI rate limit reached. Please try again after a few moments.");
        }
        else if (err.message.includes("timeout") || err.message.includes("timed out")) {
          setError("Request timed out. The server took too long to respond. Please try a simpler prompt or try again later.");
        }
        else {
          setError(err.message);
        }
      } else {
        setError("Failed to generate website. Please try again later.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div className={`flex flex-col w-full max-w-6xl mx-auto px-4 md:px-6 ${className}`}>
        <div className="flex flex-col justify-center text-center">
          <div className="max-w-4xl w-full mx-auto mb-12">
            <div className="mb-4 flex justify-center items-center">
              <Link
                href={logoHref}
                className="flex items-center gap-2 self-center font-medium"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <LogoIcon className="size-4" />
                </div>
                {logoText}
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} id={formId} className="relative">
              <Textarea
                name={textareaName}
                className="pe-24"
                placeholder={placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              {error && (
                <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="font-semibold mb-1">Error:</div>
                  <div>{error}</div>
                  
                  {/* Show extra help for connection errors */}
                  {error.toLowerCase().includes('network') || error.toLowerCase().includes('connection') ? (
                    <div className="mt-2 pt-2 border-t border-red-100 text-xs">
                      <p className="font-medium mb-1">Troubleshooting:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Check your internet connection</li>
                        <li>Verify that OpenAI services are operational</li>
                        <li>Try again in a few moments</li>
                      </ul>
                    </div>
                  ) : null}
                  
                  {/* Show extra help for OpenAI API key issues */}
                  {error.toLowerCase().includes('api key') ? (
                    <div className="mt-2 pt-2 border-t border-red-100 text-xs">
                      <p className="font-medium mb-1">Fix:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Create/edit <code className="bg-red-100 px-1 rounded">.env.local</code> in the project root</li>
                        <li>Add <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY=your_key</code></li>
                        <li>Restart the server</li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full" 
                  type={buttons.upload?.type || "button"}
                  aria-label={buttons.upload?.ariaLabel || "Upload file"}
                  disabled={isGenerating}
                >
                  <UploadIcon className="shrink-0 w-6 h-6" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full" 
                  type={buttons.submit?.type || "submit"}
                  aria-label={buttons.submit?.ariaLabel || "Submit prompt"}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                  ) : (
                    <SubmitIcon className="shrink-0 w-6 h-6" />
                  )}
                </Button>
                
                {/* Add retry button if there was a connection error */}
                {error && (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) && (
                  <div className="absolute top-full right-0 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs gap-1" 
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                      disabled={isGenerating}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 21h5v-5" />
                      </svg>
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
