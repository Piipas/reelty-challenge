import { useState } from "react";
import { Button } from "./ui/button";
import { SAMPLE_VIDEOS } from "@/data/sample-videos";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface RenderButtonProps {
  clips: typeof SAMPLE_VIDEOS;
  ratio: "portrait" | "landscape";
  texts: {
    template: string;
    start: number;
    duration: number;
    animationData: any;
  }[];
}

export function RenderButton({ clips, texts, ratio }: RenderButtonProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const handleRender = async () => {
    setIsRendering(true);
    setProgress(0);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RENDER_SERVER_URL}/api/render`, {
        method: "POST",
        body: JSON.stringify({
          clips,
          texts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) toast.info("Rendering Started, The progress showed up at the bottom.");
      const renderData = await response.json();

      const progressInterval = setInterval(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RENDER_SERVER_URL}/api/render/job/${renderData.jobId}`);
        const progressData = await response.json();

        setProgress(progressData.progress);
        if (progressData.status === "Completed" && progressData.url) {
          clearInterval(progressInterval);
          setIsRendering(false);
          toast.success("Video rendered!");
          setUrl(progressData.url);
        }
      }, 1000);
    } catch (error) {
      toast.success("Rendering failed, try again!");
      console.error(error);
    }
  };

  const handleDowndload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const blob = await response.blob();

      const localUrl = window.URL.createObjectURL(blob);
      const linkElement = document.createElement("a");
      linkElement.href = localUrl;
      linkElement.download = url.split("/").at(-1)!;
      document.body.appendChild(linkElement);
      linkElement.click();
      linkElement.remove();

      toast.success("Final video downloaded, check you Downloads folder.");
    } catch (error) {
      console.log(error);
      toast.error("Couldn't download the final video, try again!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", isRendering || "justify-end")}>
      {(isRendering || progress === 100) && (
        <Field className="w-full">
          <FieldLabel htmlFor="progress-upload">
            <span>Render progress</span>
            <span className="ml-auto">{progress}%</span>
          </FieldLabel>
          <Progress value={progress} className="w-full h-2 fill-red-500" />
        </Field>
      )}
      <Button onClick={handleRender} disabled={isRendering || clips.length === 0} className="min-w-[120px]" size={"lg"}>
        {isRendering ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Rendering...
          </span>
        ) : (
          "Render Video"
        )}
      </Button>
      {progress == 100 && (
        <Button
          onClick={handleDowndload}
          disabled={isRendering || !clips.length || progress !== 100 || isDownloading}
          size={"lg"}
          variant={"outline"}
          className="min-w-30"
        >
          {isDownloading ? (
            <>
              <LoaderCircle /> Downloading...
            </>
          ) : (
            "Download"
          )}
        </Button>
      )}
    </div>
  );
}
