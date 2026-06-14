import { LoginForm } from "@/modules/auth/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="page-shell-auth">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="page-title">Entrar</h1>
        <p className="page-subtitle">
          Faça login para acessar seus treinos.
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl ?? "/workouts"} />
    </div>
  );
}
