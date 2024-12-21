import { Controller, type Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  error: string | undefined;
  name: string;
  label?: string;
  type?: string;
  defaultValue?: string;
};

export default function FormInput({
  control,
  error,
  name,
  label = "",
  type = "text",
  defaultValue = "",
}: Props) {
  const isLabelVisible = !!label && type !== "hidden";

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div>
          {isLabelVisible && (
            <label htmlFor={name} className="block text-sm text-gray-500">
              {label}
            </label>
          )}
          <input
            id={name}
            type={type}
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
            {...field}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      )}
    />
  );
}
