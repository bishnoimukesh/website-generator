import Link from "next/link";
import React from "react";
import { FooterConfig, defaultFooterConfig } from "./footer-config";

interface FooterProps {
  config?: FooterConfig;
}

export const Footer = ({ config = defaultFooterConfig }: FooterProps) => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-4xl flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          {config.navLinks.length > 0 && (
            <nav className="flex gap-4 md:gap-6">
              {config.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {config.showCopyright && (
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} <strong>{config.companyName}.</strong> All rights reserved.
            </p>
          )}
        </div>
    </footer>
  );
}
