"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import Spinner from "./Spinner";

interface SignUpFormData {
  email: string;
  password: string;
  confirm: string;
}

interface SignUpResponse {
  ok: boolean;
  message?: string;
}

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const router = useRouter();

  const [mutate, { data, loading }] = useMutation("/api/signup");

  const onSubmit = (data: SignUpFormData) => {
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
      alert("회원가입이 완료되었습니다.");
      return router.push("/signIn");
    }

    if (data && !data.ok) {
      alert(data.message);
      return;
    }
  }, [data]);
  return (
    <div className="flex flex-col p-6 border border-black divide-gray-300 rounded-md divide-y-1">
      <div className="pb-2 w-80">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
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
              })}
              className="p-2 pl-4 text-lg text-black bg-gray-200 rounded-md outline-none focus:border-blue-500"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className="flex items-center justify-between space-x-2"
              htmlFor="confirm"
            >
              <p>비밀번호 확인</p>
              {errors.confirm && (
                <span className="text-xs text-red-500">
                  {errors.confirm.message}
                </span>
              )}
            </label>
            <input
              {...register("confirm", {
                required: "비밀번호를 확인해 주세요.",
                validate: (value) => {
                  return (
                    value === watch("password") ||
                    "비밀번호가 일치하지 않습니다."
                  );
                },
              })}
              className="p-2 pl-4 text-lg text-black bg-gray-200 rounded-md outline-none focus:border-blue-500"
              type="password"
              name="confirm"
              id="confirm"
            />
          </div>
          <div className="flex justify-center">
            <button className="px-8 py-2 border border-black rounded-md hover:bg-black hover:text-white">
              {loading ? <Spinner /> : "회원가입"}
            </button>
          </div>
          <div className="text-xs text-blue-500">
            <Link href="/signIn">이미 계정이 있으신가요?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
