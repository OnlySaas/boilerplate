import { useUser } from "@/store/use-user";

export default function Dashboard() {
  const user = useUser((state) => state.user);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {user && (
        <div>
          <p>Welcome!</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}
