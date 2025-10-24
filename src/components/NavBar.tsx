import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-transparent ">
      <div className="font-bold text-xl">ProjectFlow</div>

      <Button
        className="rounded-full "
        variant={"secondary"}
        onClick={() => navigate("/login")}
      >
        Sign In
      </Button>
    </header>
  );
}
