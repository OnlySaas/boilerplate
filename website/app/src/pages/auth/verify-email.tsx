import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/api/auth";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const verifyEmailMutation = useVerifyEmail();
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasAttemptedVerification.current) return;
      hasAttemptedVerification.current = true;

      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Invalid verification link");
        setIsVerifying(false);
        return;
      }

      try {
        await verifyEmailMutation.mutateAsync({ token });
        setIsVerified(true);
      } catch (error) {
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [location.search, verifyEmailMutation]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <Spinner className="w-10 h-10 mb-2">
          <span className="font-medium">Verifying your email...</span>
        </Spinner>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Email Verified Successfully</h1>
        <p className="text-gray-500 mb-4 w-full max-w-sm text-center">
          Your email has been verified. You can now log in.
        </p>
        <Button onClick={() => navigate("/auth/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification Failed</h1>
      <p className="text-gray-500 mb-4 w-full max-w-sm text-center">
        We couldn't verify your email. The link may have expired or is invalid.
      </p>
      <Button onClick={() => navigate("/auth/login")}>Back to Login</Button>
    </div>
  );
};
