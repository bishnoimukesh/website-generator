import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface IconFeature {
  icon: keyof typeof LucideIcons;
  title: string;
  description: string;
}

export interface IconSectionProps {
  features?: IconFeature[];
  columns?: 1 | 2 | 3 | 4;
  spacing?: {
    container?: string;
    section?: string;
    columns?: string;
    features?: string;
    icon?: string;
  };
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export const IconSection = ({
  features,
  columns = 2,
  spacing = {
    section: "max-w-4xl mx-auto",
    columns: "grid gap-6 lg:gap-12",
    features: "space-y-6 lg:space-y-10",
    icon: "ms-5 sm:ms-8",
  },
  title = "Powerful Features",
  subtitle = "Everything you need to create a professional website with just a few clicks.",
  showHeader = true,
}: IconSectionProps) => {
  const defaultFeatures: IconFeature[] = [
    {
      icon: "BrainCog",
      title: "Creative minds",
      description:
        "We choose our teams carefully. Our people are the secret to great work.",
    },
    {
      icon: "Package",
      title: "Effortless updates",
      description:
        "Benefit from automatic updates to all boards any time you need to make a change to your website.",
    },
    {
      icon: "Zap",
      title: "Strong empathy",
      description:
        "We've user tested our own process by shipping over 1k products for clients.",
    },
    {
      icon: "Trophy",
      title: "Conquer the best",
      description: "We stay lean and help your product do one thing well.",
    },
    {
      icon: "Users",
      title: "Designing for people",
      description:
        "We actively pursue the right balance between functionality and aesthetics, creating delightful experiences.",
    },
    {
      icon: "ThumbsUp",
      title: "Simple and affordable",
      description:
        "From boarding passes to movie tickets, there's pretty much nothing you can't do.",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  const featuresPerColumn = Math.ceil(displayFeatures.length / columns);
  const featureGroups: IconFeature[][] = [];

  for (let i = 0; i < columns; i++) {
    featureGroups.push(
      displayFeatures.slice(i * featuresPerColumn, (i + 1) * featuresPerColumn)
    );
  }

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
      {showHeader && (
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
        <div className={`${"max-w-4xl"} ${spacing.section}`}>
        <div
          className={`${spacing.columns} ${
            columns === 1
              ? ""
              : columns === 2
              ? "md:grid-cols-2"
              : columns === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-4"
          }`}
        >
          {featureGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={spacing.features}>
              {group.map((feature, featureIndex) => {
                const IconComponent = LucideIcons[feature.icon] as LucideIcon;
                return (
                  <div key={`${groupIndex}-${featureIndex}`} className="flex">
                    {IconComponent && (
                      <IconComponent
                        className="flex-shrink-0 mt-2 h-8 w-8"
                      />
                    )}
                    <div className={spacing.icon}>
                      <h3 className="text-base sm:text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};
