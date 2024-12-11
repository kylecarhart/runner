import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserRequestSchema, type CreateUserRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { signup } from "../clients/v1Client.ts";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserRequest>({
    resolver: zodResolver(CreateUserRequestSchema),
  });

  const onSubmit = async (data: CreateUserRequest) => {
    try {
      const response = await signup({ json: data });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      window.location.href = `/confirm-email?email=${encodeURIComponent(data.email)}`;
    } catch (error) {
      setError("root.serverError", {
        type: "400",
        message: "Failed to sign up. Please try again.",
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
          <label htmlFor="email" className="block text-sm text-gray-500">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="username" className="block text-sm text-gray-500">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-500">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
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
        {isSubmitting ? "Signing up..." : "Sign up"}
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </button>
    </form>
  );
}
