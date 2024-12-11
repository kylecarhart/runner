import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConfirmEmailRequestSchema,
  type ConfirmEmailRequest,
} from "@runner/api/src/index.js";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { confirmEmail } from "../clients/v1Client.ts";

export default function ConfirmEmailForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmEmailRequest>({
    resolver: zodResolver(ConfirmEmailRequestSchema),
  });

  const email = new URLSearchParams(document.location.search).get("email");
  if (!email) {
    return (window.location.href = "/signup");
  }

  const onSubmit = async (data: ConfirmEmailRequest) => {
    try {
      const response = await confirmEmail({ json: data });
      if (!response.ok) {
        throw response;
      }
    } catch (error) {
      setError("root.serverError", {
        type: "400",
        message: "Failed to confirm email. Please try again.",
      });
    }
  };

  return (
    <form
      className="mt-4 flex flex-col space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <div>
          <input
            {...register("email")}
            type="text"
            id="email"
            value={email}
            className="hidden"
          />
          <label htmlFor="code" className="block text-sm text-gray-500">
            Code
          </label>
          <input
            {...register("code")}
            type="text"
            id="code"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
          {errors.code?.message && (
            <p className="text-red-500 text-sm">{errors.code?.message}.</p>
          )}
          {errors.root?.serverError && (
            <p className="text-red-500 text-sm">
              {errors.root?.serverError?.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-white flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? "Confirming Email..." : "Confirm Email"}
        {isSubmitting && <LoaderCircle className="w-4 h-4 animate-spin" />}
      </button>
    </form>
  );
}
