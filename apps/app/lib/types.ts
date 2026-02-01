export interface Text {
  id: string;
  text: string;
  animation: string;
  animationData: any;
  isActive: boolean;
  startPosition: number;
  duration: number;
  startClipId?: string;
}
