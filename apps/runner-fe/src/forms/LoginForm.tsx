import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, type LoginRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../clients/v1Client.ts";
import { FormInput } from "../components/FormControl.tsx";

export default function LoginForm() {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("redirect");
    setRedirect(redirectTo);
  }, []);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login({ json: data });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // TODO: We might want to do this server side or something
      // to prevent redirecting to a malicious site.
      // Go to redirect if provided, otherwise go home.
      window.location.href = redirect || "/";
    } catch (error) {
      setError("root.serverError", {
        type: "400",
        message: "Failed to log in. Please try again.",
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
          type="email"
          label="Email"
        />
        <FormInput
          control={control}
          error={errors.password?.message}
          name="password"
          label="Password"
          type="password"
        />
        {errors.root?.serverError && (
          <p className="mt-1 text-sm text-red-500">
            {errors.root.serverError.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-white flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </button>
    </form>
  );
}
