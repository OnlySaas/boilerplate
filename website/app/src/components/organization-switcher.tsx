import {
  useCreateOrganization,
  useSwitchOrganization,
} from "@/api/organizations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/store/use-organization";
import { useUtil } from "@/store/use-util";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiTypes, OrganizationTypes } from "@saas-boilerplate/shared/types";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { undefined, z } from "zod";

const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

type CreateOrganizationModalProps = {
  setCurrentOrganization: (
    organization: OrganizationTypes.OrganizationDTO
  ) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  isDefaultOrgModal: boolean;
};

const CreateOrganizationModal = ({
  setCurrentOrganization,
  setOpen,
  open,
  isDefaultOrgModal,
}: CreateOrganizationModalProps) => {
  const { mutateAsync, isPending } = useCreateOrganization();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    try {
      const result: ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO> =
        await mutateAsync({ body: values });
      setCurrentOrganization(result.data as OrganizationTypes.OrganizationDTO);
      toast.success("Organization created successfully!");
      setOpen(false);
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (isDefaultOrgModal ? undefined : setOpen(v))}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Organization</DialogTitle>
          <DialogDescription>
            Build your organization and invite your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="My Organization"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    <p>
                      Note: This is the name that will be displayed in the
                      organization switcher.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col md:flex-row gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={isPending}>
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default function OrganizationSwitcher() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultOrgModalOpen, setDefaultOrgModalOpen] = useState(false);
  const { organizations, currentOrganization, setCurrentOrganization } =
    useOrganization();
  const { isSidebarCollapsed } = useUtil();

  const { mutateAsync: switchOrganization } = useSwitchOrganization();

  const handleOrgSwitch = async (org: OrganizationTypes.OrganizationDTO) => {
    setCurrentOrganization(org);
    await switchOrganization({ pathParams: { organizationId: org._id } });
  };

  useEffect(() => {
    if (!organizations || organizations.length === 0)
      setDefaultOrgModalOpen(true);
  }, [organizations]);

  if (!organizations || organizations.length === 0) {
    return (
      <CreateOrganizationModal
        setCurrentOrganization={setCurrentOrganization}
        setOpen={setDefaultOrgModalOpen}
        open={defaultOrgModalOpen}
        isDefaultOrgModal={true}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 gap-2",
        isSidebarCollapsed ? "justify-center p-2" : "justify-between"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {!isSidebarCollapsed ? (
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-accent hover:text-accent-foreground h-12"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-md text-foreground flex items-center justify-center bg-accent"
                  )}
                >
                  {currentOrganization?.name[0]}
                </div>
                <div className="flex flex-col items-start justify-start">
                  <div className="text-sm font-medium text-foreground truncate w-[120px] text-left">
                    {currentOrganization?.name}
                  </div>
                  <span className="text-xs text-muted-foreground font-normal">
                    Switch organization
                  </span>
                </div>
              </div>
              {!isSidebarCollapsed && (
                <ChevronDown className="size-3 opacity-50" />
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-3 w-full justify-center h-12 cursor-pointer">
              <div
                className={cn(
                  "size-10 rounded-md text-foreground flex items-center justify-center bg-accent"
                )}
              >
                {currentOrganization?.name[0]}
              </div>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuLabel className="font-normal text-xs text-accent-foreground">
            Organizations
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[200px] overflow-y-auto">
            {organizations?.map((organization) => (
              <DropdownMenuItem
                key={organization.name}
                onSelect={() => handleOrgSwitch(organization)}
                className={cn(
                  "flex items-center justify-between gap-2 cursor-pointer",
                  currentOrganization?._id === organization._id &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center space-x-3 rounded-sm",
                    currentOrganization?._id === organization._id &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-md text-foreground flex items-center justify-center bg-muted-foreground"
                    )}
                  >
                    {organization.name[0]}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-sm truncate text-foreground font-normal w-[150px]">
                      {organization.name}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-7 h-7 rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              <span>Create new organization</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateOrganizationModal
        setCurrentOrganization={setCurrentOrganization}
        setOpen={setModalOpen}
        open={modalOpen}
        isDefaultOrgModal={false}
      />
    </div>
  );
}
