import { useState, useRef, useEffect, type FormEvent } from "react";
import { useAppState } from "@/context/AppContext";
import { interviewQuestions } from "@/data/mock-data";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  setShowTyping: (v: boolean) => void;
}

export default function ChatInput({ setShowTyping }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    addMessage,
    advanceQuestion,
    currentQuestionIndex,
    interviewComplete,
    updateQualitativeField,
    rightPanelStage,
  } = useAppState();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: input.trim(),
      type: "text" as const,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);

    // Map the answer to the appropriate qualitative field
    if (currentQuestionIndex >= 0) {
      const currentQ = interviewQuestions[currentQuestionIndex];
      if (currentQ?.qualitativeField) {
        updateQualitativeField(currentQ.qualitativeField, input.trim());
      }
    }

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI typing delay then advance
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      advanceQuestion();
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isPostAssessment = interviewComplete && rightPanelStage === "assessment-results";

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 border-t border-border/50 shrink-0"
    >
      <div className="flex items-end gap-2 bg-surface-1 rounded-xl px-3 py-1.5 border border-border/30 focus-within:border-primary/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            isPostAssessment
              ? "Ask questions about your assessment results..."
              : "Share your thoughts..."
          }
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 resize-none max-h-[120px] py-1.5 leading-relaxed"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
          disabled={!input.trim()}
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </form>
  );
}
