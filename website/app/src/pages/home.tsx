import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        Welcome to the Home Page
      </h1>
      <Link to="/">
        <Button>Login</Button>
      </Link>
    </div>
  );
};
