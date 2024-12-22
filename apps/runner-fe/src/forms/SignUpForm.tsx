import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserRequestSchema, type CreateUserRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { signup } from "../clients/v1Client.ts";
import Button from "../components/Button.tsx";
import { FormInput } from "../components/FormControl.tsx";

export default function SignUpForm() {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserRequest>({
    resolver: zodResolver(CreateUserRequestSchema),
  });

  const onSubmit = async (data: CreateUserRequest) => {
    try {
      const response = await signup({ json: data });

      if (!response.ok) {
        throw response;
      }

      window.location.href = `/confirm-email?email=${encodeURIComponent(data.email)}`;
    } catch (error) {
      // TODO: Handle username or email already taken
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
        <FormInput
          control={control}
          error={errors.email?.message}
          name="email"
          label="Email"
          type="email"
          defaultValue=""
        />
        <FormInput
          control={control}
          error={errors.username?.message}
          name="username"
          label="Username"
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Signing up..." : "Sign up"}
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </Button>
    </form>
  );
}
