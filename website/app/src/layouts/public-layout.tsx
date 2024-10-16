import ToggleMode from "@/components/toggle-mode";
import { useAuth } from "@/store/use-auth";
import { useUtil } from "@/store/use-util";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicLayout() {
  const token = useAuth((state) => state.token);
  const queryParams = new URLSearchParams(window.location.search);
  const redirect = queryParams.get("redirect");
  const acceptInvitationToken = useUtil((state) => state.acceptInvitationToken);

  if (token) {
    if (acceptInvitationToken) {
      return (
        <Navigate to={`/accept-invitation?token=${acceptInvitationToken}`} />
      );
    }
    return <Navigate to={redirect || "/"} replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col  ">
      <header className="shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold ">OnlySaas Boilerplate</h1>
          <ToggleMode />
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
