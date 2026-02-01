import { replaceAnimationPlaceholder } from "@/server/utils";
import Lottie from "lottie-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export const TemplateItem = ({
  template,
  debouncedText,
  isSelected,
  onSelect,
}: {
  template: { id: string; key: string; name: string; content?: unknown; limit?: number | null };
  debouncedText: string;
  isSelected: boolean;
  onSelect: (key: string, content: unknown) => void;
}) => {
  const animationData = useMemo(() => {
    if (!template.content) return null;
    return replaceAnimationPlaceholder(template.content, debouncedText || "");
  }, [template.content, debouncedText]);

  if (!template.content || !animationData) return null;

  return (
    <button
      className={twMerge(
        "size-[350px] flex-shrink-0 rounded-3xl border-4 p-3 duration-300",
        isSelected ? "border-[#8E2DF6] bg-white" : "border-[#F5F5F5] bg-[#F5F5F5] hover:shadow-md",
      )}
      onClick={() => onSelect(template.key, template.content)}
    >
      <div className="flex size-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#F5F5F5] bg-[#A3A3A3]">
        <Lottie animationData={animationData} loop={true} autoplay={true} className="h-full w-full scale-[130%] object-cover" />
      </div>
    </button>
  );
};
