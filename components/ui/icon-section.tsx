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
  containerClassName?: string;
  iconSize?: number;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  spacing?: {
    container?: string;
    section?: string;
    columns?: string;
    features?: string;
    icon?: string;
  };
  maxWidth?: string;
}

export const IconSection = ({
  features,
  columns = 2,
  containerClassName = "container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32",
  iconSize = 8,
  iconClassName = "flex-shrink-0 mt-2",
  titleClassName = "text-base sm:text-lg font-semibold",
  descriptionClassName = "mt-1 text-muted-foreground",
  spacing = {
    section: "max-w-4xl mx-auto",
    columns: "grid gap-6 lg:gap-12",
    features: "space-y-6 lg:space-y-10",
    icon: "ms-5 sm:ms-8",
  },
  maxWidth = "max-w-4xl",
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
    <div className={containerClassName}>
      <div className={`${maxWidth} ${spacing.section}`}>
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
                        className={`${iconClassName} h-${iconSize} w-${iconSize}`}
                      />
                    )}
                    <div className={spacing.icon}>
                      <h3 className={titleClassName}>{feature.title}</h3>
                      <p className={descriptionClassName}>
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
  );
};
