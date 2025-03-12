import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventRequestSchema, type CreateEventRequest } from "@runner/api";
import { Button } from "@runner/ui/components/button";
import { Calendar } from "@runner/ui/components/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormGroup,
  FormItem,
  FormLabel,
  FormMessage,
} from "@runner/ui/components/form";
import { Input } from "@runner/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@runner/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@runner/ui/components/select";
import { Textarea } from "@runner/ui/components/textarea";
import { cn } from "@runner/ui/utils";
import { US_STATES } from "@runner/utils";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { createEvent } from "../clients/v1Client.ts";
import Separator from "../components/Separator.tsx";

export default function CreateEventForm() {
  const form = useForm<CreateEventRequest>({
    resolver: zodResolver(CreateEventRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
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
    <div>
      <Form {...form}>
        <h2 className="text-lg font-medium">Event Details</h2>
        <form className="mt-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
            {/* When? */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Event start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal h-10 flex",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Where? */}
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
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
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
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
