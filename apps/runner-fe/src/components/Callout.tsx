import { Info } from "lucide-react";
import { cn } from "../utils/cn.ts";

type Props = {
  title?: string;
  children: React.ReactNode;
  icon?: "info";
  className?: string;
};

const icons = {
  info: <Info className="h-4 w-4" />,
};

export default function Callout({ title, children, icon, className }: Props) {
  return (
    <div
      className={cn(
        "text-sm w-full rounded-lg border border-gray-200 bg-gray-50 py-4 px-6 flex gap-2",
        className,
      )}
    >
      {icon && <div>{icons[icon]}</div>}
      <div>
        {title && <div className="font-medium text-gray-900">{title}</div>}
        <span className="text-gray-700 italic">{children}</span>
      </div>
    </div>
  );
}
