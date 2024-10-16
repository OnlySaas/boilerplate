import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AudioLines, File, ListTodo } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { to: "/todos", icon: ListTodo, label: "Todos" },
    { to: "/assets", icon: File, label: "Assets" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-sidebar-width flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 px-2 sm:py-4">
        <Link
          to="/"
          className="group flex h-9 w-full shrink-0 items-center px-3 py-2 gap-2 text-lg font-semibold text-primary md:h-8 md:w-full md:text-base"
        >
          <AudioLines className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="hidden md:block font-medium text-sm">
            OnlySaas Boilerplate
          </span>
        </Link>
        {navItems.map((item) => (
          <Tooltip key={item.to} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={item.to}
                className={`flex h-10 w-56 items-center px-3 py-2 gap-2 rounded-md transition-colors md:h-10 md:w-56 hover:bg-accent hover:text-accent-foreground ${
                  location.pathname === item.to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:block font-medium text-sm">
                  {item.label}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}
