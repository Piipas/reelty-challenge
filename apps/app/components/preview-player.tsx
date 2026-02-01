import { Player, PlayerRef } from "@remotion/player";
import { useRef } from "react";
import { RootComposition, FRAMES_PER_SECOND } from "@rendy/remotion";
import { SAMPLE_VIDEOS } from "@/data/sample-videos";
import { prepareTexts } from "../lib/utils";

export function PreviewPlayer({ clips, texts }: { clips: typeof SAMPLE_VIDEOS; texts: ReturnType<typeof prepareTexts> }) {
  const playerRef = useRef<PlayerRef>(null);
  const duration = clips.reduce((acc, clip) => acc + clip.duration * FRAMES_PER_SECOND, 0);

  return (
    <div className="relative flex flex-col max-h-full h-auto justify-center items-center overflow-hidden overflow-y-auto rounded-3xl border border-[#F6F6F6] bg-slate-500 md:flex space-y-2">
      <Player
        ref={playerRef}
        component={RootComposition}
        compositionWidth={1080}
        compositionHeight={1920}
        durationInFrames={duration}
        fps={FRAMES_PER_SECOND}
        controls
        loop
        initiallyMuted
        inputProps={{
          clips,
          texts: texts.map((text) => {
            const from = clips.slice(0, text.start).reduce((sum, clip) => sum + clip.duration, 0);
            return { ...text, from };
          }),
        }}
      />
    </div>
  );
}
