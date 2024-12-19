import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConfirmEmailRequestSchema,
  type ConfirmEmailRequest,
} from "@runner/api/src/index.js";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { confirmEmail } from "../clients/v1Client.ts";

export default function ConfirmEmailForm() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmEmailRequest>({
    defaultValues: {
      email: "",
      code: "",
    },
    resolver: zodResolver(ConfirmEmailRequestSchema),
  });

  // Redirect to signup if no email is provided
  useEffect(() => {
    const email = new URLSearchParams(document.location.search).get("email");
    if (email === null) {
      window.location.href = "/signup";
      return;
    }
    setValue("email", email);
  }, []);

  const onSubmit = async (data: ConfirmEmailRequest) => {
    try {
      const response = await confirmEmail({ json: data });
      if (!response.ok) {
        throw response;
      }
      window.location.href = "/";
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
      <p className="text-sm text-gray-500 text-center">
        If you don't receive the email, please check your spam folder, <br />
        or{" "}
        <a href="#" className="font-bold">
          {/* TODO: Add a resend email button */}
          click here
        </a>{" "}
        to resend the email.
      </p>
    </form>
  );
}
