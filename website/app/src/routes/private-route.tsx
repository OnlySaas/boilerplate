import { useCurrentUser } from "@/api/users";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/use-auth";
import { useUtil } from "@/store/use-util";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useCurrentUser();
  const authToken = useAuth((state) => state.token);
  const { setAcceptInvitationToken } = useUtil();
  const location = useLocation();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (token) setAcceptInvitationToken(token);
  }, [token]);

  if (!authToken)
    return <Navigate to="/auth/login" state={{ from: location }} replace />;

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner className="flex flex-col items-center justify-center gap-4 mb-2">
          <span className="text-lg font-semibold">
            Activating your app...
          </span>
          <span className="text-sm text-muted-foreground">
            Hold on, they're almost ready!
          </span>
        </Spinner>
      </div>
    );

  return children ? children : <Outlet />;
}
