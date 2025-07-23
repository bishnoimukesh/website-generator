import { RegisterForm } from "@/components/ui/register-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account to access all features.",
};
export default function RegisterPage(
): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm/>
      </div>
    </div>
  );
}