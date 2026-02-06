import { useState, type FormEvent } from "react";
import { useAppState } from "@/context/AppContext";
import { interviewQuestions } from "@/data/mock-data";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  setShowTyping: (v: boolean) => void;
}

export default function ChatInput({ setShowTyping }: ChatInputProps) {
  const [input, setInput] = useState("");
  const {
    addMessage,
    advanceQuestion,
    currentQuestionIndex,
    interviewComplete,
    updateApplicationField,
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

    // Map the answer to the appropriate form field
    if (currentQuestionIndex >= 0) {
      const currentQ = interviewQuestions[currentQuestionIndex];
      if (currentQ?.fieldMapping) {
        updateApplicationField(currentQ.fieldMapping, {
          value: isNaN(Number(input)) ? input.trim() : Number(input),
          source: "self-reported",
        });
      }
    }

    setInput("");

    // Simulate AI typing delay then advance
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      advanceQuestion();
    }, 800);
  };

  const isDisabled = interviewComplete && rightPanelStage === "assessment-results";

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 border-t border-border/50 shrink-0"
    >
      <div className="flex items-center gap-2 bg-surface-1 rounded-xl px-3 py-1.5 border border-border/30 focus-within:border-primary/50 transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isDisabled
              ? "Assessment complete — ask questions about results"
              : "Type your response..."
          }
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
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
