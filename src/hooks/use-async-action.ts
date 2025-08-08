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
    key?: string,
    setErrorPersonalizado?: (error: {
      error: string;
      success: BaseResponse<any> | null;
    }) => void
  ) => Promise<void>;
  reset: () => void;
  resetError: () => void;
};

export function useAsyncAction<T>(): ApiResponseState<T> {
  const [response, setResponse] = useState<BaseResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<AsyncActionState>("init");

  const execute = useCallback(
    async (
      action: () => Promise<BaseResponse<T>>,
      key?: string,
      setErrorPersonalizado?: (error: {
        error: string;
        success: BaseResponse<any> | null;
      }) => void
    ) => {
      setState("loading");
      setError(null);
      setResponse(null);

      try {
        const result = await action();
        setResponse(result);
        setState("success");

        if (setErrorPersonalizado) {
          setErrorPersonalizado({
            error: "",
            success: result,
          });
        }

        if (key) {
          mutate(key);
        }
      } catch (err: any) {
        const errMsg = err?.response?.data?.message ?? "Network Error";

        setError(errMsg);
        setState("error");

        // Llama a la función personalizada si existe
        if (setErrorPersonalizado) {
          setErrorPersonalizado({
            error: errMsg,
            success: null,
          });
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState("init");
    setError(null);
    setResponse(null);
  }, []);

  const resetError = useCallback(() => {
    setState("init");
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
    resetError,
  };
}
