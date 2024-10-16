"use client";

import { useUpdateProfile } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/store/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Fingerprint, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { user } = useUser();

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: user?.firstName,
    lastName: user?.lastName,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile({ body: data });
    } catch (error) {}
  }

  const copyToClipboard = (text: string | undefined, item: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Your ${item} has been copied.`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 justify-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <h3 className="text-sm text-muted-foreground">
            Manage your personal information.
          </h3>
        </div>
      </div>
      <div className="px-4 py-2 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Your Profile</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        name="firstName"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value}
                                placeholder="John"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="lastName"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value}
                                placeholder="Doe"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" loading={isUpdatingProfile}>
                      Update Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <motion.div
              className="rounded-lg shadow-sm overflow-hidden bg-accent"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="p-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-accent-foreground truncate">
                    {user?.email}
                  </p>
                  {user?.isEmailVerified && (
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(user?.email, "email")}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy email</span>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="rounded-lg shadow-sm overflow-hidden bg-accent"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="p-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-full">
                    <Fingerprint className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm text-accent-foreground">User ID</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {user?._id}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(user?._id, "User ID")}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy User ID</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
