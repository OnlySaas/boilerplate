import ProtectedLayout from "@/layouts/protected-layout";
import PublicLayout from "@/layouts/public-layout";
import ListTodos from "@/pages/todo/list-todos";
import TodoDetails from "@/pages/todo/todo-details";
import ForgotPassword from "@/pages/auth/forgot-password";
import Login from "@/pages/auth/login";
import ResetPassword from "@/pages/auth/reset-password";
import Signup from "@/pages/auth/signup";
import VerifyEmail from "@/pages/auth/verify-email";
import Dashboard from "@/pages/dashboard";
import AcceptInvitation from "@/pages/invitation/accept-invitation";
import NotFound from "@/pages/not-found";
import Billing from "@/pages/organization/billing";
import Members from "@/pages/organization/members";
import Settings from "@/pages/organization/settings";
import Profile from "@/pages/profile";
import PrivateRoute from "@/routes/private-route";
import { createBrowserRouter, RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <ProtectedLayout />
          </PrivateRoute>
        ),
        errorElement: <div>Protected Error</div>,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "todos",
            children: [
              {
                index: true,
                element: <ListTodos />,
              },
              {
                path: ":todoId",
                element: <TodoDetails />,
              },
            ],
          },
          {
            path: "assets",
            element: <div>Assets</div>,
          },
          {
            path: "call-logs",
            element: <div>Call Logs</div>,
          },
          {
            path: "organization",
            children: [
              {
                path: "members",
                element: <Members />,
              },
              {
                path: "billing",
                element: <Billing />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "accept-invitation",
        element: (
          <PrivateRoute>
            <AcceptInvitation />
          </PrivateRoute>
        ),
      },
      {
        element: <PublicLayout />,
        errorElement: <div>Error</div>,
        children: [
          {
            path: "/auth",
            errorElement: <div>Auth Error</div>,
            children: [
              {
                index: true,
                element: <Login />,
              },
              {
                path: "login",
                element: <Login />,
              },
              {
                path: "signup",
                element: <Signup />,
              },
              {
                path: "forgot-password",
                element: <ForgotPassword />,
              },
              {
                path: "reset-password",
                element: <ResetPassword />,
              },
              {
                path: "verify-email",
                element: <VerifyEmail />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
