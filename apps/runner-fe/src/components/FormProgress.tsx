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
    <ol className={cn("space-y-2", className)}>
      {steps.map((step, index) => (
        <FormStep
          key={index}
          intent={
            index === currentStep
              ? "active"
              : index < currentStep
                ? "completed"
                : "default"
          }
        >
          {step.title}
        </FormStep>
      ))}
    </ol>
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

interface FormStepProps
  extends React.LiHTMLAttributes<HTMLLIElement>,
    VariantProps<typeof formStep> {}

/**
 * Single step in the form
 * @param param0
 * @returns
 */
export function FormStep({
  intent = "default",
  size = "default",
  children,
}: FormStepProps) {
  const Icon =
    intent === "completed"
      ? CircleCheck
      : intent === "active"
        ? CircleDot
        : Circle;

  return (
    <li className={cn(formStep({ intent, size }))}>
      <Icon className="h-4 w-4" />
      {children}
    </li>
  );
}
