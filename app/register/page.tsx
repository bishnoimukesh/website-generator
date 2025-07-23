// Use register-form component for the registration page
import { RegisterForm } from "@/components/ui/register-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account to access all features.",
};
export default function RegisterPage(
  props: React.ComponentProps<"div">
): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm {...props} />
      </div>
    </div>
  );
}