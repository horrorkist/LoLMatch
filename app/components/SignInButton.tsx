"use client";

import { Provider } from "next-auth/providers";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface SignInButtonProps {
  provider: Provider;
}

export default function SignInButton({ provider }: SignInButtonProps) {
  return provider.name === "Naver" ? (
    <button
      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
      className="p-2 px-4 w-full rounded-md justify-center text-white bg-[#03C75A] flex space-x-2"
    >
      <span className="font-extrabold">N</span>
      <p>Sign in with Naver</p>
    </button>
  ) : (
    <button
      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
      className="w-full p-2 border border-black rounded-md hover:bg-black hover:text-white"
    >
      Sign in with {provider.name}
    </button>
  );
}
