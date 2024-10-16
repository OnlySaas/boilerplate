"use client";

import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { useCreateInvitation } from "@/api/invitation";
import {
  useEditMemberRole,
  useGetOrganizationMembers,
  useRemoveMemberRole,
} from "@/api/organizations";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganization } from "@/store/use-organization";
import { useUser } from "@/store/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationTypes } from "@saas-boilerplate/shared/types";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import PendingInvitations from "./pending-invitations";

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["owner", "admin", "member"]),
});

const editMemberRoleSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
type EditMemberRoleFormValues = z.infer<typeof editMemberRoleSchema>;
export default function Members() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [members, setMembers] = useState<
    OrganizationTypes.OrganizationMemberListResponse[]
  >([]);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [isEditMemberRoleModalOpen, setIsEditMemberRoleModalOpen] =
    useState(false);
  const [member, setMember] =
    useState<OrganizationTypes.OrganizationMemberListResponse | null>(null);
  const user = useUser((state) => state.user);
  const currentOrganization = useOrganization(
    (state) => state.currentOrganization
  );

  const { mutate: removeMemberRole, isPending: isRemovingMemberRole } =
    useRemoveMemberRole();

  const columns: ColumnDef<OrganizationTypes.OrganizationMemberListResponse>[] =
    [
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase ml-4">{row.original.email}</div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <div className="capitalize">
            <Badge>{row.getValue("role")}</Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const isOwner = currentOrganization?.members.some(
            (member) => member.user._id === user?._id && member.role === "owner"
          );
          return (
            <div className="flex items-center gap-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="outline"
                    loading={
                      member?._id === row.original._id && isEditingMemberRole
                    }
                    disabled={
                      !isOwner ||
                      (row.original.role === "owner" &&
                        row.original._id === user?._id)
                    }
                    onClick={() => {
                      setIsEditMemberRoleModalOpen(true);
                      setMember(row.original);
                      editMemberRoleForm.setValue("role", row.original.role);
                    }}
                  >
                    <PencilIcon className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit role</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={
                      !isOwner ||
                      (row.original.role === "owner" &&
                        row.original._id === user?._id)
                    }
                    loading={
                      member?._id === row.original._id && isRemovingMemberRole
                    }
                    onClick={() => {
                      setMember(row.original);
                      onRemoveMember(row.original._id);
                    }}
                  >
                    <TrashIcon className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {row.original.role === "owner"
                    ? "Can't remove owner"
                    : "Remove Member"}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ];

  const { mutate: createInvitation, isPending: isCreatingInvitation } =
    useCreateInvitation();

  const { data, isLoading, refetch } = useGetOrganizationMembers({
    enabled: !!currentOrganization,
    pathParams: {
      organizationId: currentOrganization?._id as string,
    },
  });

  const inviteMemberForm = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: "member" },
  });

  const editMemberRoleForm = useForm<EditMemberRoleFormValues>({
    resolver: zodResolver(editMemberRoleSchema),
    defaultValues: { role: "member" },
  });

  const { mutate: editMemberRole, isPending: isEditingMemberRole } =
    useEditMemberRole();

  useEffect(() => {
    if (data && !isLoading) setMembers(data.data);
  }, [data, isLoading]);

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const onSubmit = async (values: InviteMemberFormValues) => {
    try {
      await createInvitation(
        {
          body: { email: values.email, role: values.role },
          pathParams: { organizationId: currentOrganization?._id as string },
        },
        {
          onSuccess: () => {
            setIsInviteMemberModalOpen(false);
            inviteMemberForm.reset();
          },
        }
      );
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  const onEditMemberRole = async (values: EditMemberRoleFormValues) => {
    try {
      await editMemberRole(
        {
          body: { role: values.role },
          pathParams: {
            organizationId: currentOrganization?._id as string,
            memberId: member?._id as string,
          },
        },
        {
          onSuccess: () => {
            refetch();
            setIsEditMemberRoleModalOpen(false);
            editMemberRoleForm.reset();
          },
        }
      );
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  const onRemoveMember = async (memberId: string) => {
    try {
      await removeMemberRole(
        {
          pathParams: {
            organizationId: currentOrganization?._id as string,
            memberId,
          },
        },
        {
          onSuccess: () => refetch(),
        }
      );
    } catch {
      // Error is already handled in the mutation hook
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 justify-center">
          <h1 className="text-2xl font-bold">Members</h1>
          <h3 className="text-sm text-muted-foreground">
            Manage your organization members.
          </h3>
        </div>
      </div>
      <Tabs defaultValue="members" className="mt-4 w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <div className="flex items-center py-4 ml-1 justify-between">
            <Input
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setIsInviteMemberModalOpen(true)}>
                Invite Member
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Spinner size="small">
                        <span className="text-xs">Loading members...</span>
                      </Spinner>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="invitations">
          <PendingInvitations />
        </TabsContent>
      </Tabs>

      <Dialog
        open={isInviteMemberModalOpen}
        onOpenChange={setIsInviteMemberModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Teammate</DialogTitle>
            <DialogDescription>
              Invite and grow your team in one click!
            </DialogDescription>
          </DialogHeader>
          <Form {...inviteMemberForm}>
            <form
              className="flex flex-col gap-4"
              onSubmit={inviteMemberForm.handleSubmit(onSubmit)}
            >
              <div className="grid grid-rows-2">
                <FormField
                  control={inviteMemberForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="johndoe@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={inviteMemberForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-14">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="owner"
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col items-start gap-1">
                                Owner
                                <p className="text-xs text-muted-foreground">
                                  Manage billing, organization settings, etc
                                </p>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="admin"
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col items-start gap-1">
                                Admin
                                <p className="text-xs text-muted-foreground">
                                  Manage organization settings, etc
                                </p>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="member"
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col items-start gap-1">
                                Member
                                <p className="text-xs text-muted-foreground">
                                  View access to organization resources
                                </p>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="justify-end gap-1">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" loading={isCreatingInvitation}>
                  Send Invite
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditMemberRoleModalOpen}
        onOpenChange={setIsEditMemberRoleModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
            <DialogDescription>Edit the role of the member.</DialogDescription>
          </DialogHeader>
          <Form {...editMemberRoleForm}>
            <form
              className="flex flex-col gap-4"
              onSubmit={editMemberRoleForm.handleSubmit(onEditMemberRole)}
            >
              <div className="flex gap-1">
                <span className="text-sm font-bold">Email:</span>
                <p className="text-sm">{member?.email}</p>
              </div>
              <Controller
                control={editMemberRoleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-14">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner" className="cursor-pointer">
                            <div className="flex flex-col items-start gap-1">
                              Owner
                              <p className="text-xs text-muted-foreground">
                                Manage billing, organization settings, etc
                              </p>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin" className="cursor-pointer">
                            <div className="flex flex-col items-start gap-1">
                              Admin
                              <p className="text-xs text-muted-foreground">
                                Manage organization settings, etc
                              </p>
                            </div>
                          </SelectItem>
                          <SelectItem value="member" className="cursor-pointer">
                            <div className="flex flex-col items-start gap-1">
                              Member
                              <p className="text-xs text-muted-foreground">
                                View access to organization resources
                              </p>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="justify-end gap-1">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" loading={isEditingMemberRole}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
