import { BaseResponse } from "@/interface";
import { useState, useCallback } from "react";
import { mutate } from "swr";

export type AsyncActionState = "init" | "loading" | "success" | "error";

type ApiResponseState<T> = {
  response: BaseResponse<T> | null;
  error: string | null;
  state: AsyncActionState;
  isLoading: boolean;
  isFromInit: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (
    action: () => Promise<BaseResponse<T>>,
    key?: string
  ) => Promise<void>;
  reset: () => void;
};

export function useAsyncAction<T>(): ApiResponseState<T> {
  const [response, setResponse] = useState<BaseResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<AsyncActionState>("init");

  const execute = useCallback(
    async (action: () => Promise<BaseResponse<T>>, key?: string) => {
      setState("loading");
      setError(null);
      setResponse(null);

      try {
        const result = await action();
        setResponse(result);
        setState("success");

        if (key) {
          mutate(key);
        }
      } catch (err: any) {
        const errMsg = err instanceof Error ? err.message : "Error inesperado";
        setError(errMsg);
        setState("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState("init");
    setError(null);
    setResponse(null);
  }, []);

  return {
    response,
    error,
    state,
    isFromInit: state === "init",
    isLoading: state === "loading",
    isSuccess: state === "success",
    isError: state === "error",
    execute,
    reset,
  };
}
