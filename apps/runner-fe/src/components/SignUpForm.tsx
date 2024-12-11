import type { CreateUserRequest } from "@runner/api";
import { useForm } from "react-hook-form";
import { signup } from "../clients/v1Client.ts";

export default function SignUpForm() {
  const { register, handleSubmit } = useForm<CreateUserRequest>();

  const onSubmit = async (data: CreateUserRequest) => {
    try {
      const response = await signup({ json: data });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      // Handle successful signup here
      window.location.href = `/confirm-email?email=${encodeURIComponent(data.email)}`;
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
      <div className="space-y-2">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-500">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm text-gray-500">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-500">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="block w-full bg-transparent rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Sign up
      </button>
    </form>
  );
}
