import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConfirmEmailRequestSchema,
  type ConfirmEmailRequest,
} from "@runner/schemas/email-confirmation";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { confirmEmail } from "../clients/v1Client.ts";

export default function ConfirmEmailForm() {
  const form = useForm<ConfirmEmailRequest>({
    defaultValues: {
      email: "",
      code: "",
    },
    resolver: zodResolver(ConfirmEmailRequestSchema),
  });
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

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
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errors.root?.serverError && (
            <p className="text-red-500 text-sm">
              {errors.root?.serverError?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Confirming Email..." : "Confirm Email"}
          {isSubmitting && <LoaderCircle className="w-4 h-4 animate-spin" />}
        </Button>

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
    </Form>
  );
}
