"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { trpc } from "@/api/client";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "./ui/button";
import { TemplateItem } from "./template-item";

interface TextDockProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  selectedTextAnimation: string | null;
  setSelectedTextAnimation: (key: string | null) => void;
  setSelectedAnimationData: (data: any) => void;
  onApplyText: () => void;
  onReset: () => void;
  hasAppliedText?: boolean;
}

export default function TextDock({
  isOpen,
  setIsOpen,
  textInput,
  setTextInput,
  selectedTextAnimation,
  setSelectedTextAnimation,
  setSelectedAnimationData,
  onApplyText,
  onReset,
  hasAppliedText = false,
}: TextDockProps) {
  const debouncedTextInput = useDebounce(textInput, 300);
  const [originalTextInput, setOriginalTextInput] = useState(textInput);
  const [originalAnimation, setOriginalAnimation] = useState(selectedTextAnimation);
  const [wasOpen, setWasOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !wasOpen) {
      setOriginalTextInput(textInput);
      setOriginalAnimation(selectedTextAnimation);
    }
    setWasOpen(isOpen);
  }, [isOpen, textInput, selectedTextAnimation, wasOpen]);

  const { data: templates, isLoading, error } = trpc.textTemplates.getAll.useQuery(undefined, { enabled: isOpen });
  const hasChanges = textInput !== originalTextInput || selectedTextAnimation !== originalAnimation;
  const characterLimit = templates?.find((t) => t.key === selectedTextAnimation)?.limit ?? null;
  const exceedsLimit = !!characterLimit && textInput.length > characterLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput && selectedTextAnimation && hasChanges && !exceedsLimit) onApplyText();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textInput && selectedTextAnimation && hasChanges && !exceedsLimit) {
      e.preventDefault();
      onApplyText();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="absolute inset-0 z-60 flex w-full items-end px-5 pb-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full rounded-3xl border border-[#F6F6F6] bg-white"
            style={{
              boxShadow:
                "0px -6px 13px 0px #0000000A, 0px -24px 24px 0px #00000008, 0px -55px 33px 0px #00000005, 0px -97px 39px 0px #00000003, 0px -152px 42px 0px #00000000",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex items-center justify-between space-x-4 rounded-t-3xl bg-[#FBFBFB] p-6">
              <div className="relative flex w-full items-center">
                <input
                  type="text"
                  placeholder="Add your text here"
                  className="w-full rounded-[10px] border border-[#EDEDED] bg-white px-2.5 py-3 duration-300 outline-none placeholder:text-[#BFBFBF] hover:border-black focus:border-black"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                {characterLimit && (
                  <div className="group absolute top-2.5 right-2.5 size-8">
                    <div
                      className={twMerge(
                        "relative flex size-full flex-col items-center justify-center rounded-full p-0.5",
                        exceedsLimit ? "bg-red-500" : "bg-[#F0F0F0]",
                      )}
                    >
                      {!exceedsLimit && (
                        <svg width={64} height={64} viewBox="-6.25 -6.25 62.5 62.5" xmlns="http://www.w3.org/2000/svg" className="absolute -rotate-90">
                          <circle
                            r="15"
                            cx="25"
                            cy="25"
                            stroke="#141715"
                            strokeWidth={3}
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={100}
                            strokeDashoffset={100 - (textInput.length * 100) / characterLimit}
                            className="transition-all duration-300"
                          />
                        </svg>
                      )}
                      <div
                        className={twMerge(
                          "relative flex size-full items-center justify-center rounded-full bg-white text-sm",
                          exceedsLimit ? "text-red-500" : "text-[#A3A3A3]",
                        )}
                      >
                        <p>{characterLimit - textInput.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {hasAppliedText && (
                  <Button variant="secondary" type="button" onClick={onReset}>
                    Reset
                  </Button>
                )}
                <Button type="submit" disabled={!textInput || !selectedTextAnimation || !hasChanges || exceedsLimit}>
                  Apply Changes
                </Button>
              </div>
            </form>
            <div className="scrollbar scrollbar-h-1.5 scrollbar-thumb-[#E9E9E9] scrollbar-thumb-rounded-full scrollbar-hover:scrollbar-thumb-black mb-2.5 w-full overflow-x-auto p-8 pt-6">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center p-4 text-red-500">
                  <p>Failed to load text animations. Please try again.</p>
                </div>
              )}
              {templates && (
                <div className="flex gap-4">
                  {templates.map((template) => (
                    <TemplateItem
                      key={template.key}
                      template={template}
                      debouncedText={debouncedTextInput}
                      isSelected={selectedTextAnimation === template.key}
                      onSelect={(key, content) => {
                        setSelectedTextAnimation(key);
                        // ✅ you need this setter passed from parent
                        setSelectedAnimationData(content);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
