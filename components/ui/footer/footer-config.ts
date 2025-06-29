export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterConfig {
  navLinks: FooterLink[];
  companyName: string;
  showCopyright: boolean;
}

export const defaultFooterConfig: FooterConfig = {
  navLinks: [
    {
      href: "#terms",
      label: "Terms",
    },
    {
      href: "#privacy",
      label: "Privacy",
    },
    {
      href: "#contact",
      label: "Contact",
    },
  ],
  companyName: "Website Builder",
  showCopyright: true,
};
