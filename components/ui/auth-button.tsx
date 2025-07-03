"use client"

import * as React from "react";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { createClient } from "@/utils/supabase/client";

export const AuthButton = () => {
  const [user, setUser] = React.useState<{
    id: string;
    email?: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
    };
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative h-8 w-8 rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.user_metadata?.first_name && user.user_metadata?.last_name
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : 'User'
                }
              </p>
            </div>
          </div>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">Sign in</Link>
    </Button>
  );
};
