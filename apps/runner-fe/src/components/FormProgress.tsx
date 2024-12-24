import { cva, type VariantProps } from "class-variance-authority";
import { Circle, CircleCheck, CircleDot } from "lucide-react";
import { cn } from "../utils/cn.ts";

type Step = {
  title: string;
};

interface Props {
  className?: string;
  steps: Step[];
  currentStep: number;
}

/**
 * Vertical form progression
 * @param param0
 * @returns
 */
export function FormProgress({ className, steps, currentStep }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      {steps.map((step, index) => (
        <FormStep
          key={index}
          title={step.title}
          intent={
            index === currentStep
              ? "active"
              : index < currentStep
                ? "completed"
                : "default"
          }
        />
      ))}
    </div>
  );
}

const formStep = cva("flex items-center gap-3 w-full cursor-pointer", {
  variants: {
    intent: {
      default: "",
      completed: "text-gray-500",
      active: "font-medium bg-gray-50 border border-gray-200",
    },
    size: {
      default: "text-sm rounded-lg px-3 py-2",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "default",
  },
});

interface FormStepProps extends VariantProps<typeof formStep> {
  title: string;
}

/**
 * Single step in the form
 * @param param0
 * @returns
 */
export function FormStep({
  title,
  intent = "default",
  size = "default",
}: FormStepProps) {
  const Icon =
    intent === "completed"
      ? CircleCheck
      : intent === "active"
        ? CircleDot
        : Circle;

  return (
    <div className={cn(formStep({ intent, size }))}>
      <Icon className="h-4 w-4" />
      {title}
    </div>
  );
}
