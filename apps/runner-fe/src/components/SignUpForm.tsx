import { useForm } from "react-hook-form";
import type { CreateUserRequest } from "../../../../packages/api/src/user.ts";
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
      window.location.href = "/";
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm text-gray-500">
              First Name
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              className="block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm text-gray-500">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              id="lastName"
              className="block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm text-gray-500">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-500">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block w-full rounded-md border border-gray-300 p-2"
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
            className="block w-full rounded-md border border-gray-300 p-2"
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
