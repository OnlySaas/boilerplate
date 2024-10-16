"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserDropdown from "@/components/user-dropdown";
import { cn } from "@/lib/utils";
import { useUtil } from "@/store/use-util";
import { IconFileAi, IconPhoneCall } from "@tabler/icons-react";
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OrganizationSwitcher from "./organization-switcher";

const organizationNavItems = [
  {
    to: "/organization/settings",
    icon: Settings,
    label: "Settings",
    disabled: false,
  },
  {
    to: "/organization/members",
    icon: Users,
    label: "Members",
    disabled: false,
  },
  {
    to: "/organization/billing",
    icon: CreditCard,
    label: "Billing",
    disabled: false,
  },
  {
    to: "/organization/notifications",
    icon: Bell,
    label: "Notifications",
    disabled: true,
  },
];

const navItems = [
  { to: "/", icon: Home, label: "Home", disabled: false },
  { to: "/todos", icon: ListTodo, label: "Todos", disabled: false },
];

export default function CollapsibleSidebar() {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useUtil();
  const location = useLocation();
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  return (
    <TooltipProvider>
      <div className="relative flex h-screen">
        <div
          className={cn(
            "bg-background text-foreground border-r border-border h-screen flex flex-col transition-all duration-300",
            isSidebarCollapsed ? "w-14" : "w-64"
          )}
        >
          <OrganizationSwitcher />
          {!isSidebarCollapsed && (
            <div className="px-4 pb-4">
              <Input type="search" placeholder="Search" className="w-full" />
            </div>
          )}
          <nav className="px-2 py-1">
            <ul className="space-y-1">
              {organizationNavItems.map((item) => (
                <li key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.to}
                        className={cn("disabled:cursor-not-allowed", {
                          "cursor-not-allowed pointer-events-none":
                            !!item.disabled,
                        })}
                      >
                        <Button
                          variant="ghost"
                          disabled={!!item.disabled}
                          size="sm"
                          className={cn(
                            "w-full justify-start text-xs",
                            isSidebarCollapsed && "justify-center",
                            (location.pathname === item.to ||
                              location.pathname.startsWith(item.to + "/")) &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              !isSidebarCollapsed && "mr-2"
                            )}
                          />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>
          <Separator className="my-2" />
          <nav className="px-2 py-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.to}
                        className={cn("disabled:cursor-not-allowed", {
                          "cursor-not-allowed pointer-events-none":
                            !!item.disabled,
                        })}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={item.disabled}
                          className={cn(
                            "w-full justify-start hover:bg-accent hover:text-accent-foreground text-xs",
                            isSidebarCollapsed && "justify-center",
                            (location.pathname === item.to ||
                              location.pathname.startsWith(item.to + "/")) &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              !isSidebarCollapsed && "mr-2"
                            )}
                          />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>
          <UserDropdown />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 -right-3 size-6 rounded-full bg-background border border-border hover:bg-accent z-10 hover:text-accent-foreground"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-3" />
              ) : (
                <ChevronLeft className="size-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>
              {isSidebarCollapsed
                ? "Expand sidebar (Ctrl+B)"
                : "Collapse sidebar (Ctrl+B)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
