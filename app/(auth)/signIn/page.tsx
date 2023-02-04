import { getProviders } from "next-auth/react";
import LoginForm from "../../components/LoginForm";

export default async function SignIn() {
  const providers = await getProviders();
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <LoginForm providers={providers} />
    </div>
  );
}
