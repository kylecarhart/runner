import type { ConfirmEmailRequest } from "@runner/api";
import { useForm } from "react-hook-form";
import { confirmEmail } from "../clients/v1Client.ts";

export default function ConfirmEmailForm() {
  const { register, handleSubmit } = useForm<ConfirmEmailRequest>();
  const email = new URLSearchParams(document.location.search).get("email");

  if (!email) {
    return <div>No email provided</div>;
  }

  const onSubmit = async (data: ConfirmEmailRequest) => {
    try {
      const response = await confirmEmail({ json: data });

      if (!response.ok) {
        throw new Error("Email confirmation failed");
      }

      console.log(response);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  return (
    <form
      className="mt-4 flex flex-col space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div>
          <input
            {...register("email")}
            type="text"
            id="email"
            value={email}
            className="hidden"
          />
          <label htmlFor="code" className="block text-sm text-gray-500">
            Code
          </label>
          <input
            {...register("code")}
            type="text"
            id="code"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Confirm Email
      </button>
    </form>
  );
}
