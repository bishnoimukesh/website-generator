import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  changeValue?: string;
  changeDirection?: "up" | "down";
}

export interface ApplicationStatsProps {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  showHeader?: boolean;
}

export const ApplicationStats = ({
  title = "By The Numbers",
  subtitle = "See why users love our platform",
  stats = [
    {
      label: "Total users",
      value: "72,540",
      changeValue: "1.7%",
      changeDirection: "up",
    },
    {
      label: "Sessions",
      value: "29.4%",
    },
    {
      label: "Avg. Click Rate",
      value: "56.8%",
      changeValue: "1.7%",
      changeDirection: "down",
    },
    {
      label: "Pageviews",
      value: "92,913",
    },
  ],

}: ApplicationStatsProps) => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="pt-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </h3>
                    {stat.changeValue && stat.changeDirection && (
                      <span
                        className={`flex items-center gap-x-1 ${
                          stat.changeDirection === "up"
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {stat.changeDirection === "up" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        <span className="text-sm">{stat.changeValue}</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
