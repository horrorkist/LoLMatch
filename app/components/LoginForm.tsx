"use client";

import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import SignInButton from "./SignInButton";
import Spinner from "./Spinner";

interface LogInFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  ok: boolean;
  user?: User;
  message?: string;
}

export default function LoginForm({ providers }: { providers: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>();

  const router = useRouter();

  const [mutate, { data, loading }] = useMutation<LoginResponse>("/api/signin");

  const onSubmit = (data: LogInFormData) => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    mutate(
      {
        email: data.email,
        password: data.password,
      },
      "POST"
    );
  };

  useEffect(() => {
    if (data && data.ok) {
      router.replace("/");
    }

    if (data && !data.ok) {
      alert(data.message);
    }
  }, [data]);

  return (
    <div className="flex flex-col p-6 border border-black divide-gray-300 rounded-md divide-y-1">
      <div className="w-full pb-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-6"
        >
          <div className="flex flex-col space-y-2">
            <label
              className="flex items-center justify-between space-x-2"
              htmlFor="email"
            >
              <p>이메일</p>
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </label>
            <input
              {...register("email", {
                required: "이메일을 입력해 주세요.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "이메일 형식이 아닙니다.",
                },
              })}
              className="p-2 pl-4 text-lg text-black bg-gray-200 rounded-md outline-none focus:border-blue-500"
              type="text"
              name="email"
              id="email"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className="flex items-center justify-between space-x-2"
              htmlFor="password"
            >
              <p>비밀번호</p>
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </label>
            <input
              {...register("password", {
                required: "비밀번호를 입력해 주세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 8자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 20,
                  message: "비밀번호는 20자 이하여야 합니다.",
                },
                // pattern: {
                //   value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
                //   message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
                // },
              })}
              className="p-2 pl-4 text-lg text-black bg-gray-200 rounded-md outline-none focus:border-blue-500"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <div className="flex justify-center">
            <button className="px-8 py-2 border border-black rounded-md hover:bg-black hover:text-white">
              {loading ? <Spinner /> : "로그인"}
            </button>
          </div>
          <div className="text-xs text-blue-500">
            <Link href="/signUp">아직 계정이 없으신가요?</Link>
          </div>
        </form>
      </div>
      <ul className="grid grid-cols-2 gap-2 pt-6">
        {providers &&
          Object.values(providers!).map((provider: any) => {
            return (
              <li key={provider.name}>
                <SignInButton provider={provider} />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
