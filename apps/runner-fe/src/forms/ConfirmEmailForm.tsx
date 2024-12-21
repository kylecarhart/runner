import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConfirmEmailRequestSchema,
  type ConfirmEmailRequest,
} from "@runner/api/src/index.js";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { confirmEmail } from "../clients/v1Client.ts";
import FormInput from "../components/FormInput";

export default function ConfirmEmailForm() {
  const {
    control,
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
      // TODO: Maybe add a toast here.
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
        <FormInput
          control={control}
          error={errors.email?.message}
          name="email"
          type="hidden"
        />
        <FormInput
          control={control}
          error={errors.code?.message}
          name="code"
          label="Code"
        />
        {errors.root?.serverError && (
          <p className="text-red-500 text-sm">
            {errors.root?.serverError?.message}
          </p>
        )}
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
