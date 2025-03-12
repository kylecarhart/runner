import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, type LoginRequest } from "@runner/api/user";
import { Button } from "@runner/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@runner/ui/components/form";
import { Input } from "@runner/ui/components/input";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../clients/v1Client.ts";

export default function LoginForm() {
  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;
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
          {isSubmitting ? "Logging in..." : "Log in"}
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
