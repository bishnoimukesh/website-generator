export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface GalleryItem {
  title: string;
  description: string;
  image: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  hours: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  style: string;
}

export interface WebsiteSection {
  type: string;
  layout?: string;
  heading: string;
  subheading?: string;
  content?: string;
  cta?: string;
  image?: string;
  background?: string;
  items?: FeatureItem[] | GalleryItem[];
  testimonials?: TestimonialItem[];
  plans?: PricingPlan[];
  info?: ContactInfo;
}

export interface WebsiteContent {
  title: string;
  description: string;
  theme?: ThemeSettings;
  sections: WebsiteSection[];
}
