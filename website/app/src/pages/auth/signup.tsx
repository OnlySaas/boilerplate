import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister, useResendVerificationEmail } from "@/api/auth";
import { toast } from "sonner";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { mutateAsync, isPending } = useRegister();
  const {
    mutateAsync: mutateResendVerificationEmail,
    isPending: isResendVerificationEmailPending,
  } = useResendVerificationEmail();
  const [isSignupComplete, setIsSignupComplete] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const result = await mutateAsync(values);
      if (result.success) setIsSignupComplete(true);
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  const handleResendVerification = async () => {
    // Implement resend verification logic here
    const result = await mutateResendVerificationEmail({
      email: form.getValues("email"),
    });
    if (result.success) {
      toast.success("Verification email resent. Please check your inbox.");
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {!isSignupComplete ? (
            <>
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                  Create an account to get started
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" loading={isPending}>
                    Sign Up
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="underline">
                  Login
                </Link>
              </div>
            </>
          ) : (
            <div className="grid gap-4 text-center">
              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a verification email to your inbox. Please click the
                link in the email to verify your account.
              </p>
              <Button
                onClick={handleResendVerification}
                loading={isResendVerificationEmailPending}
              >
                Resend Verification Email
              </Button>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or click the
                button above to resend.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden bg-muted lg:block rounded-lg">
        {/* Add image or content for the right side if needed */}
      </div>
    </div>
  );
};
