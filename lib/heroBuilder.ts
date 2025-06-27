// lib/heroBuilder.ts

export interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  alignment?: "left" | "center" | "right";
  textColor?: string;
}

export interface UIElement {
  type: string;
  content?: string;
  style?: Record<string, any>;
  action?: string;
  children?: UIElement[];
}

export interface ComponentResponse {
  componentType: string;
  structure: UIElement;
}

export function buildHeroComponent(props: HeroProps): ComponentResponse {
  const {
    title = "Default Hero Title",
    subtitle = "",
    backgroundImage = "",
    primaryButtonText = "Learn More",
    primaryButtonLink = "#",
    secondaryButtonText = null,
    secondaryButtonLink = null,
    alignment = "center",
    textColor = "#000000",
  } = props;

  return {
    componentType: "hero",
    structure: {
      type: "section",
      style: {
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        color: textColor,
        textAlign: alignment,
        padding: "60px 20px",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      children: [
        {
          type: "h1",
          content: title,
          style: { marginBottom: "16px" },
        },
        subtitle
          ? {
              type: "p",
              content: subtitle,
              style: { marginBottom: "32px", fontSize: "18px", opacity: 0.8 },
            }
          : null,
        {
          type: "div",
          style: { display: "flex", gap: "16px", justifyContent: alignment },
          children: [
            {
              type: "button",
              content: primaryButtonText,
              action: primaryButtonLink,
              style: "primary",
            },
            secondaryButtonText
              ? {
                  type: "button",
                  content: secondaryButtonText,
                  action: secondaryButtonLink || "#",
                  style: "secondary",
                }
              : null,
          ].filter(Boolean),
        },
      ].filter(Boolean),
    },
  };
}
