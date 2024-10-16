import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/use-auth";
import { useUser } from "@/store/use-user";
import { useUtil } from "@/store/use-util";
import { useQueryClient } from "@tanstack/react-query";
import { Laptop, LogOut, Moon, Sparkles, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserDropdown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSidebarCollapsed } = useUtil();
  const { theme, setTheme } = useTheme();
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const logout = useAuth((state) => state.logout);

  const handleLogout = async () => {
    logout();
    queryClient.clear();
    navigate("/auth/login");
    setUser(null);
  };

  return (
    <div className="p-4 pb-2 mt-auto">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "flex items-center w-full bg-accent hover:text-accent-foreground h-12 cursor-pointer rounded-md px-2 gap-2",
                  isSidebarCollapsed &&
                    "justify-center hover:bg-transparent h-8"
                )}
              >
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col items-start select-none">
                    <span className="text-sm font-medium">
                      {user?.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal truncate w-[150px] text-start">
                      {user?.email}
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>User settings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </DropdownMenuLabel>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CreditCard className="mr-2 size-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPlus className="mr-2 size-4" />
            <span>Invite a member</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="mr-2 size-4" />
            <span>Discord</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <div className="p-2">
            <div className="flex items-center justify-between space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "w-full",
                      theme === "light" && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4" />
                    <span className="sr-only">Light theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Light theme</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "w-full",
                      theme === "dark" && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4" />
                    <span className="sr-only">Dark theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dark theme</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "w-full",
                      theme === "system" && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="size-4" />
                    <span className="sr-only">System theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>System theme</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
          >
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 size-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
