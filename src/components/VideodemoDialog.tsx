import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VideoDemoDialog() {
  return (
    <DialogContent className="w-[95vw] max-w-6xl max-h-[50vh] md:max-h-[90vh] p-6 bg-background shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-border">
      <DialogHeader className="p-4">
        <DialogTitle className="text-sm">
          Project Flow The ultimate Project Manger
        </DialogTitle>
      </DialogHeader>
      <div className="relative  w-full aspect-video">
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
