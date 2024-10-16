import { useUpdateOrganization } from "@/api/organizations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useOrganization } from "@/store/use-organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
});

type UpdateOrganizationValues = z.infer<typeof updateOrganizationSchema>;

export default function Settings() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) console.log("Organization deleted");
    else setConfirmDelete(true);
  };
  const { currentOrganization } = useOrganization();
  const { mutateAsync: updateOrganization, isPending } =
    useUpdateOrganization();

  const form = useForm<UpdateOrganizationValues>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name: currentOrganization?.name },
  });

  const onSubmit = async (data: UpdateOrganizationValues) => {
    try {
      await updateOrganization({
        pathParams: { organizationId: currentOrganization?._id as string },
        body: { name: data.name },
      });
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  useEffect(() => {
    if (currentOrganization) {
      form.setValue("name", currentOrganization.name);
    }
  }, [currentOrganization]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1 justify-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <h3 className="text-sm text-muted-foreground">
          Manage your organization settings.
        </h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Organization Name</CardTitle>
              <CardDescription>
                Used to identify your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder="Organization Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="text-sm text-muted-foreground">
                  Organization ID:
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentOrganization?._id}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    if (currentOrganization?._id) {
                      navigator.clipboard.writeText(
                        currentOrganization?._id as string
                      );
                      toast.success("Organization ID copied to clipboard");
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit" loading={isPending}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Delete Organization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Warning: This action cannot be undone. This will permanently delete
            your organization and remove all associated data.
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>All projects will be deleted</li>
            <li>All team members will lose access</li>
            <li>Billing information will be removed</li>
          </ul>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button variant="destructive" onClick={handleDelete} disabled>
            {confirmDelete ? (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Confirm Delete Organization
              </>
            ) : (
              "Delete Organization"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
