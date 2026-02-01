import { AbsoluteFill, Composition, Sequence } from "remotion";
import { TextComposition } from "./text";
import { Video } from "@remotion/media";
import { FRAMES_PER_SECOND } from "../lib/constants";

export const RootComposition: React.FC<{
  clips: { url: string; duration: number }[];
  texts: { start: number; duration: number; from: number; animationData: any }[];
}> = ({ clips, texts }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {clips.map((clip, index) => (
        <Sequence
          key={clip.url}
          from={index === 0 ? 0 : clips.slice(0, index).reduce((sum, c) => sum + c.duration * FRAMES_PER_SECOND, 0)}
          durationInFrames={clip.duration * FRAMES_PER_SECOND}
        >
          <Video src={clip.url} />
        </Sequence>
      ))}

      {texts.map((text, index) => (
        <Sequence key={index} from={text.from * FRAMES_PER_SECOND} durationInFrames={text.duration * FRAMES_PER_SECOND}>
          <TextComposition animationData={text.animationData} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
