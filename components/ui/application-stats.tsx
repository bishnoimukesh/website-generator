import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ApplicationStats = () => {
  return (
    <div className="container mx-auto px-4 py-10 md:px-6 2xl:max-w-[1400px]">
        <h1 className="text-xl py-4 text-xl font-semibold">User Engagements</h1>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {/* Card */}
        <Card className="pt-0">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Total users
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium sm:text-2xl">72,540</h3>
                <span className="flex items-center gap-x-1 text-green-700 dark:text-green-400">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm">1.7%</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card className="pt-0">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Sessions
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium sm:text-2xl">29.4%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card className="pt-0">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Avg. Click Rate
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium sm:text-2xl">56.8%</h3>
                <span className="flex items-center gap-x-1 text-red-700 dark:text-red-400">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-sm">1.7%</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card className="pt-0">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Pageviews
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <h3 className="text-xl font-medium sm:text-2xl">92,913</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
