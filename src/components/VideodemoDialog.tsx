import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VideoDemoDialog() {
  return (
    <DialogContent className="max-w-md bg-black p-0 overflow-hidden">
      <DialogHeader className="p-4">
        <DialogTitle className="text-sm">
          Project Flow The ultimate Project Manger
        </DialogTitle>
      </DialogHeader>
      <div className="relative w-full aspect-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/0ajLMU9Elw8?si=3RjG9MkI6flJF964"
          title="Project Flow - Project Management App"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-b-lg"
        ></iframe>
      </div>
    </DialogContent>
  );
}
