import React from "react";
import { Code, Globe, Wand2, LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

export const HowItWorks = ({
  title = "How It Works",
  subtitle = "Generate a complete website in three simple steps - no design or coding knowledge required.",
  steps = [
    {
      icon: Wand2,
      title: "1. Describe Your Vision",
      description:
        "Enter a detailed description of your dream website using simple language.",
    },
    {
      icon: Globe,
      title: "2. Generate Website",
      description:
        "Our AI builds a custom website based on your description in seconds.",
    },
    {
      icon: Code,
      title: "3. Export or Customize",
      description:
        "Download your site or make additional customizations as needed.",
    },
  ],
}: HowItWorksProps) => {
  return (
    <section className="w-full py-16 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">{subtitle}</p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
