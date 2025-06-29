import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd, Send, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./textarea";

export const HeroPrompt = () => {
  return (
      <div className="flex flex-col w-full h-[calc(100vh-180px)] justify-center">
        <div className="flex-grow py-12 lg:py-16 flex flex-col justify-center">
          <div className="max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex justify-center items-center">
              <Link
                href="#"
                className="flex items-center gap-2 self-center font-medium"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                Web Builder
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">
              Welcome to Web Builder
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your AI-powered copilot for building the web
            </p>
          </div>
          <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <Textarea
              className="pe-24"
              placeholder="Generate a website for my business..."
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Button size="sm" variant="ghost" className="rounded-full">
                  <UploadCloud className="shrink-0 w-6 h-6" />
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full">
                  <Send className="shrink-0 w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
