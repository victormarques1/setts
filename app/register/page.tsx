import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="page-shell-auth">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cadastro</h1>
        <p className="text-muted-foreground">
          Crie sua conta para começar a registrar sua progressão.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
