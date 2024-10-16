import CollapsibleSidebar from "@/components/collapsible-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen">
      <CollapsibleSidebar />
      <ScrollArea className="flex-1 p-5 pb-4 overflow-hidden h-screen">
        <Outlet />
      </ScrollArea>
    </div>
  );
};
