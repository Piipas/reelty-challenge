import { Composition } from "remotion";
import { RootComposition } from "./compositions/main";
import { FRAMES_PER_SECOND } from "./lib/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VideoEditor"
      component={RootComposition}
      durationInFrames={3600}
      fps={FRAMES_PER_SECOND}
      width={1080}
      height={1920}
      defaultProps={{ clips: [], texts: [] }}
    />
  );
};
