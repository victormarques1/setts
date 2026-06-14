import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="page-shell-auth">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="page-title">Cadastro</h1>
        <p className="page-subtitle">
          Crie sua conta para começar a registrar sua progressão.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
