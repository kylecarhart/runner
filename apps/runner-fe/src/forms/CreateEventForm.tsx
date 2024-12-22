import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventRequestSchema, type CreateEventRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { createEvent } from "../clients/v1Client.ts";
import Button from "../components/Button.tsx";
import { FormInput, FormTextarea } from "../components/FormControl.tsx";

export default function CreateEventForm() {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventRequest>({
    resolver: zodResolver(CreateEventRequestSchema),
  });

  const onSubmit = async (data: CreateEventRequest) => {
    try {
      const response = await createEvent({ json: data });

      if (!response.ok) {
        throw new Error("Create event failed");
      }
    } catch (error) {
      setError("root.serverError", {
        type: "400",
        message: "Failed to create event...",
      });
    }
  };

  return (
    <form
      className="mt-4 flex flex-col space-y-8 min-w-96"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <FormInput
          control={control}
          error={errors.name?.message}
          name="name"
          type="text"
          label="Name"
        />
        <FormTextarea
          control={control}
          error={errors.description?.message}
          name="description"
          label="Description"
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
        {isSubmitting ? "Creating event..." : "Create event"}
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </Button>
    </form>
  );
}
