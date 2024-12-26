import {
  Controller,
  type Control,
  type ControllerRenderProps,
} from "react-hook-form";

type BaseProps = {
  control: Control<any>;
  error: string | undefined;
  name: string;
  label?: string;
  defaultValue?: string;
  isRequired?: boolean;
};

function FormControl({
  control,
  error,
  name,
  label = "",
  defaultValue = "",
  isRequired = true,
  children,
}: BaseProps & {
  children: (field: ControllerRenderProps<any, string>) => React.ReactNode;
}) {
  const isLabelVisible = !!label;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div>
          {isLabelVisible && (
            <label htmlFor={name} className="block text-sm text-gray-500">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
          )}
          {children(field)}
          {error && <p className="mt-1 text-sm text-red-500">{error}.</p>}
        </div>
      )}
    />
  );
}

export function FormInput({
  type = "text",
  ...props
}: BaseProps & { type?: string }) {
  return (
    <FormControl {...props}>
      {(field) => (
        <input
          id={props.name}
          type={type}
          className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          {...field}
        />
      )}
    </FormControl>
  );
}

export function FormTextarea({
  rows = 3,
  ...props
}: BaseProps & { rows?: number }) {
  return (
    <FormControl {...props}>
      {(field) => (
        <textarea
          id={props.name}
          rows={rows}
          className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          {...field}
        />
      )}
    </FormControl>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
}

export function FormGroup({ children }: FormGroupProps) {
  return <div className="space-y-4">{children}</div>;
}
