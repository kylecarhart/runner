import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserRequestSchema, type CreateUserRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { signup } from "../clients/v1Client.ts";

export default function SignUpForm() {
  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(CreateUserRequestSchema),
  });
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

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
    <Form {...form}>
      <form
        className="mt-4 flex flex-col space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
