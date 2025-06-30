import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd, Send, UploadCloud, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./textarea";

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
  className = "",
  formAction,
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

  return (
      <div className={`flex flex-col w-full h-[calc(100vh-180px)] justify-center ${className}`}>
        <div className="flex-grow py-12 lg:py-16 flex flex-col justify-center">
          <div className="max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
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
            <form action={formAction} id={formId} className="relative">
              <Textarea
              name={textareaName}
              className="pe-24"
              placeholder={placeholder}
              defaultValue={defaultValue}
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full" 
                  type={buttons.upload?.type || "button"}
                  aria-label={buttons.upload?.ariaLabel || "Upload file"}
                >
                  <UploadIcon className="shrink-0 w-6 h-6" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full" 
                  type={buttons.submit?.type || "submit"}
                  aria-label={buttons.submit?.ariaLabel || "Submit prompt"}
                >
                  <SubmitIcon className="shrink-0 w-6 h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
