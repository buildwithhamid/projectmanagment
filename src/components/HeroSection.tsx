import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VideoDemoDialog } from "./VideodemoDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative text-center py-14 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-semibold leading-tight mb-4">
          Take control of Project <br className="hidden sm:block" /> Manager
        </h1>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 max-w-2xl">
          ProjectFlow helps you stay organized, manage your projects
          effectively, and keep track of your progress. All in one simple and
          intuitive platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
          <Button
            className="rounded-full w-full sm:w-auto text-sm sm:text-base"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="rounded-full w-full sm:w-auto text-sm sm:text-base"
                variant="outline"
              >
                Watch Demo
              </Button>
            </DialogTrigger>

            <VideoDemoDialog />
          </Dialog>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row justify-center px-3">
        <img
          src="/hero.png"
          alt="App Preview"
          className="w-full max-w-[95%] sm:max-w-[80%] md:max-w-[70%] rounded-2xl shadow-2xl border border-gray-700 transition-transform duration-300 hover:scale-[1.02]"
        />
        <img
          src="/public/hom2.png"
          alt="App Preview"
          className="w-full md:hidden max-w-[95%] sm:max-w-[80%] md:max-w-[70%] rounded-2xl shadow-2xl border border-gray-700 transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
    </section>
  );
}
