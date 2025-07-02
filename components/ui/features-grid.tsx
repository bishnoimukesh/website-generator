import React from "react";
import { Sparkles, LayoutGrid, FileCode } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeaturesGridProps {
  features?: FeatureItem[];
  columns?: 1 | 2 | 3 | 4;
  maxWidth?: string;
}

export const FeaturesGrid = ({
  features,
  columns = 3,
}: FeaturesGridProps) => {

  const defaultFeatures: FeatureItem[] = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-2" />,
      title: "AI-Powered Design",
      description: "Leverage the latest AI technology to create stunning websites from simple text prompts."
    },
    {
      icon: <LayoutGrid className="h-10 w-10 text-primary mb-2" />,
      title: "Customizable Templates",
      description: "Choose from a variety of professionally designed templates to match your brand."
    },
    {
      icon: <FileCode className="h-10 w-10 text-primary mb-2" />,
      title: "Export Code",
      description: "Download clean, optimized code to use on your own hosting platform."
    }
  ];

  const displayFeatures = features || defaultFeatures;
  const gridColumnsClass = 
    columns === 1 ? "" :
    columns === 2 ? "sm:grid-cols-2" :
    columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" :
    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className={`${"grid gap-6"} ${gridColumnsClass} ${"mx-auto"}`}>
          {displayFeatures.map((feature, index) => (
            <Card key={index} className="bg-card/50 border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
