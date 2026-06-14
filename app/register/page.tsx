import { AppLogo } from "@/components/layout/app-logo";
import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="page-shell-auth">
      <div className="flex justify-center">
        <AppLogo size="lg" />
      </div>
      <RegisterForm />
    </div>
  );
}
