import { useGetTodo } from "@/api/todo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useOrganization } from "@/store/use-organization";
import { useUtil } from "@/store/use-util";
import { IconCpu, IconLanguage, IconScript } from "@tabler/icons-react";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TodoDetails() {
  const { todoId } = useParams();
  const { setIsSidebarCollapsed } = useUtil();
  const currentOrganization = useOrganization(
    (state) => state.currentOrganization
  );
  const navigate = useNavigate();

  const { data, isLoading } = useGetTodo({
    pathParams: {
      todoId: todoId as string,
      organizationId: currentOrganization?._id as string,
    },
  });

  useEffect(() => {
    setIsSidebarCollapsed(true);
  }, []);

  const handleBack = () => {
    navigate(`/todos`);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="small">Loading todo...</Spinner>
      </div>
    );

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 pb-6 px-1">
        <Button size="icon" onClick={handleBack} className="size-7">
          <ChevronLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">{data?.data?.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IconCpu className="size-4 text-gray-500" />
              <p className="text-sm text-gray-500">{data?.data?.priority}</p>
            </div>
            <div className="flex items-center gap-1">
              <IconLanguage className="size-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                {new Date(data?.data?.dueDate as Date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <IconScript className="size-4 text-gray-500" />
              <p className="text-sm text-gray-500">{data?.data?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
