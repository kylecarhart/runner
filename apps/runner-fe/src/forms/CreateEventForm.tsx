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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventRequestSchema, type CreateEventRequest } from "@runner/api";
import { US_STATES } from "@runner/utils";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { createEvent } from "../clients/v1Client.ts";
import { FormGroup } from "../components/FormControl.tsx";
import Separator from "../components/Separator.tsx";

export default function CreateEventForm() {
  const form = useForm<CreateEventRequest>({
    resolver: zodResolver(CreateEventRequestSchema),
  });
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

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
    <Form {...form}>
      <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-medium mb-2">Event Details</h2>
        <FormGroup>
          {/* Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a short description of the event"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            {/* City */}
            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Zip */}
            <FormField
              control={control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
    </Form>
  );
}
