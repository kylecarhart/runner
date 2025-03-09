import { Button } from "@/components/ui/button";
import type { User } from "@runner/api";
import { ChevronDown, LogOut } from "lucide-react";
import { logout } from "../clients/v1Client.ts";

type Props = {
  user: User;
};

export default function NavProfile({ user }: Props) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span>Hi {user.username}!</span>
        <ChevronDown className="size-4 cursor-pointer" />
      </div>
      <Button
        variant="ghost"
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
        Logout <LogOut className="size-4" />
      </Button>
    </div>
  );
}
