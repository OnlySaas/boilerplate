import { useAcceptInvitation, useGetInvitation } from "@/api/invitation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/use-auth";
import { useUser } from "@/store/use-user";
import { useUtil } from "@/store/use-util";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AcceptInvitation() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const user = useUser((state) => state.user);
  const navigate = useNavigate();
  const { acceptInvitationToken, setAcceptInvitationToken } = useUtil();
  const [isAccountConflict, setIsAccountConflict] = useState(false);
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [invitationError, setInvitationError] = useState<any | null>(null);

  const { mutate: acceptInvitation, isPending: isAcceptingInvitation } =
    useAcceptInvitation();

  const { data, isLoading, error, refetch } = useGetInvitation({
    enabled: false,
    pathParams: {
      token: acceptInvitationToken as string,
    },
  });

  useEffect(() => {
    if (user) refetch();
  }, [user]);

  useEffect(() => {
    if (data && !isLoading) {
      if (data?.data?.email === user?.email) setIsAccountValid(true);
      else setIsAccountConflict(true);
    }
    if (error) setInvitationError(error);
  }, [data, isLoading, error]);

  const handleLogout = async () => {
    logout();
    queryClient.clear();
    navigate("/auth/login");
  };

  const handleAcceptInvitation = async () => {
    try {
      acceptInvitation({
        pathParams: { token: acceptInvitationToken as string },
      });
      setAcceptInvitationToken(null);
      navigate("/");
    } catch (error) {}
  };

  if (invitationError)
    return (
      <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <CrossCircledIcon className="w-10 h-10 text-red-500" />
          <h1 className="text-xl font-bold">
            {invitationError?.response?.data?.message ||
              invitationError?.message ||
              "Something went wrong"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            Please try again later.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setAcceptInvitationToken(null);
              navigate("/");
            }}
          >
            Discard
          </Button>
          <Button onClick={() => navigate("/")}>Go to dashboard</Button>
        </div>
      </div>
    );

  if (isAccountConflict)
    return (
      <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <CrossCircledIcon className="w-10 h-10 text-red-500" />
          <h1 className="text-xl font-bold">Account conflict</h1>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            You are already logged in with another account. Please log out of
            that account to accept this invitation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLogout}>Log out</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAcceptInvitationToken(null);
              navigate("/");
            }}
          >
            Go to dashboard
          </Button>
        </div>
        <p className="text-xs text-muted-foreground max-w-sm text-center">
          Note: This might happen if you are not registered yet or you are
          registered with different email.
        </p>
      </div>
    );

  if (isAccountValid)
    return (
      <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <CheckCircledIcon className="w-10 h-10 text-green-500" />
          <h1 className="text-xl font-bold">Accepting invitation</h1>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            Please wait while we accept your invitation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAcceptInvitation()}
            loading={isAcceptingInvitation}
          >
            Accept invitation
          </Button>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner className="flex flex-col items-center justify-center gap-4 mb-2">
            <h1 className="text-xl font-bold">Checking invitation</h1>
            <p className="text-sm text-muted-foreground max-w-sm text-center">
              Please wait while we check your invitation.
            </p>
          </Spinner>
        </div>
      </div>
    );

  return null;
}
