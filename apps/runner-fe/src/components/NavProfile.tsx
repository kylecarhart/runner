import type { User } from "@runner/api";
import { ChevronDown } from "lucide-react";
import { logout } from "../clients/v1Client.ts";
import Button from "./Button.tsx";

type Props = {
  user: User;
};

export default function NavProfile({ user }: Props) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span>Hi {user.username}!</span>
        <ChevronDown className="h-4 w-4 cursor-pointer" />
      </div>
      <Button
        intent="ghost"
        onClick={() => {
          logout()
            .then(() => {
              console.log("Logged out");
              window.location.href = "/";
            })
            .catch((error) => {
              console.error("Error logging out", error);
            });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
