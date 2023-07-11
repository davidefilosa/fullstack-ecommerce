import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-4">
      <p>Hello admin dashboard</p>
      <Button size="default" variant="destructive">
        Click Me
      </Button>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
