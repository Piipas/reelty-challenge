import VideoEditor from "@/components/video-editor";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden bg-[#FBFBFB]">
      <div className="flex h-full max-h-full flex-1 flex-col overflow-hidden p-4 md:p-8">
        <VideoEditor />
      </div>
    </div>
  );
}
