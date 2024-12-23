import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventRequestSchema, type CreateEventRequest } from "@runner/api";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { createEvent } from "../clients/v1Client.ts";
import Button from "../components/Button.tsx";
import {
  FormGroup,
  FormInput,
  FormTextarea,
} from "../components/FormControl.tsx";
import Separator from "../components/Separator.tsx";

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
    <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-medium mb-2">Event Details</h2>
      <FormGroup>
        {/* Name */}
        <FormInput
          control={control}
          error={errors.name?.message}
          name="name"
          type="text"
          label="Name"
        />
        {/* Description */}
        <FormTextarea
          control={control}
          error={errors.description?.message}
          name="description"
          label="Description"
        />

        {/* Address */}
        <FormInput
          control={control}
          error={errors.address?.message}
          name="address"
          type="text"
          label="Event Address"
        />
        <div className="grid grid-cols-3 gap-2">
          {/* City */}
          <FormInput
            control={control}
            error={errors.city?.message}
            name="city"
            type="text"
            label="City"
          />
          {/* State */}
          <FormInput
            control={control}
            error={errors.state?.message}
            name="state"
            type="text"
            label="State"
          />
          {/* Zip */}
          <FormInput
            control={control}
            error={errors.zip?.message}
            name="zip"
            type="text"
            label="Zip"
          />
        </div>
      </FormGroup>

      {errors.root?.serverError && (
        <p className="mt-1 text-sm text-red-500">
          {errors.root.serverError.message}
        </p>
      )}

      <Separator />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Creating event..." : "Next"}
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </Button>
    </form>
  );
}
