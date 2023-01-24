import { useState } from "react";

interface UseMutaionState<T> {
  loading: boolean;
  errors?: object;
  data?: T;
}

type UseMutaionResult<T> = [
  (data: any, method: Methods) => void,
  UseMutaionState<T>
];

type Methods = "POST" | "PATCH";

export default function useMutation<T = any>(url: string): UseMutaionResult<T> {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<undefined | any>(undefined);
  const [data, setData] = useState<undefined | any>(undefined);

  async function mutate(data: any, method: Methods) {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const parsed = await response.json();
      setData(parsed);
    } catch (e) {
      setErrors(e);
    }
    setLoading(false);
  }

  return [mutate, { loading, errors, data }];
}
