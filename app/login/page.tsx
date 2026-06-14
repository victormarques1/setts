import { AppLogo } from "@/components/layout/app-logo";
import { LoginForm } from "@/modules/auth/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="page-shell-auth">
      <div className="flex justify-center">
        <AppLogo size="lg" />
      </div>
      <LoginForm callbackUrl={callbackUrl ?? "/workouts"} />
    </div>
  );
}
