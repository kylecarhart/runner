import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * Select component that provides a styled dropdown menu
 */
const Select = SelectPrimitive.Root;

/**
 * Component for grouping select options
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * Component that displays the selected value
 */
const SelectValue = SelectPrimitive.Value;

/**
 * Button component that triggers the select dropdown
 */
const SelectTrigger = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.Trigger>>;
  }
) => (<SelectPrimitive.Trigger
  ref={ref}
  className={cn(
    "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    className,
  )}
  {...props}
>
  {children}
  <SelectPrimitive.Icon asChild>
    <ChevronDown className="size-4 opacity-50" />
  </SelectPrimitive.Icon>
</SelectPrimitive.Trigger>);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Button for scrolling up through select options
 */
const SelectScrollUpButton = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>;
  }
) => (<SelectPrimitive.ScrollUpButton
  ref={ref}
  className={cn(
    "flex cursor-default items-center justify-center py-1",
    className,
  )}
  {...props}
>
  <ChevronUp className="size-4" />
</SelectPrimitive.ScrollUpButton>);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

/**
 * Button for scrolling down through select options
 */
const SelectScrollDownButton = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>;
  }
) => (<SelectPrimitive.ScrollDownButton
  ref={ref}
  className={cn(
    "flex cursor-default items-center justify-center py-1",
    className,
  )}
  {...props}
>
  <ChevronDown className="size-4" />
</SelectPrimitive.ScrollDownButton>);
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

/**
 * Container component for the select dropdown content
 */
const SelectContent = (
  {
    ref,
    className,
    children,
    position = "popper",
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.Content>>;
  }
) => (<SelectPrimitive.Portal>
  <SelectPrimitive.Content
    ref={ref}
    className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className,
    )}
    position={position}
    {...props}
  >
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport
      className={cn(
        "p-1",
        position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
      )}
    >
      {children}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>);
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * Label component for select option groups
 */
const SelectLabel = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.Label>>;
  }
) => (<SelectPrimitive.Label
  ref={ref}
  className={cn("px-2 py-1.5 text-sm font-semibold", className)}
  {...props}
/>);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * Individual selectable option component
 */
const SelectItem = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.Item>>;
  }
) => (<SelectPrimitive.Item
  ref={ref}
  className={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
    className,
  )}
  {...props}
>
  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
    <SelectPrimitive.ItemIndicator>
      <Check className="size-4" />
    </SelectPrimitive.ItemIndicator>
  </span>
  <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
</SelectPrimitive.Item>);
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * Visual separator component for select options
 */
const SelectSeparator = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
    ref: React.RefObject<React.ElementRef<typeof SelectPrimitive.Separator>>;
  }
) => (<SelectPrimitive.Separator
  ref={ref}
  className={cn("-mx-1 my-1 h-px bg-muted", className)}
  {...props}
/>);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
