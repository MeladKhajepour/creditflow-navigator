import { motion } from "framer-motion";
import type { ChatMessage } from "@/types";
import { useAppState } from "@/context/AppContext";
import { Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const { addMessage, advanceQuestion, setRightPanelStage, setIsAssessing, setAssessment } = useAppState();
  const isAI = message.role === "ai";

  const handleQuickReply = (value: string, label: string) => {
    addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: label,
      type: "text",
      timestamp: new Date().toISOString(),
    });

    if (value === "submit") {
      setRightPanelStage("assessment-results");
      setIsAssessing(true);
      // Simulate assessment
      import("@/services/api").then(({ getAssessment }) => {
        getAssessment("APP-mock").then((result) => {
          setAssessment(result);
          setIsAssessing(false);
          addMessage({
            id: `ai-result-${Date.now()}`,
            role: "ai",
            content: "Your assessment is complete! You can view the detailed results on the right panel. Feel free to ask me any questions about the findings.",
            type: "text",
            timestamp: new Date().toISOString(),
          });
        });
      });
    } else if (value === "review") {
      addMessage({
        id: `ai-review-${Date.now()}`,
        role: "ai",
        content: "You can review and edit your application on the right panel. Let me know when you're ready to submit.",
        type: "text",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSelectOption = (value: string, label: string) => {
    addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: label,
      type: "text",
      timestamp: new Date().toISOString(),
    });

    if (message.fieldMapping) {
      import("@/context/AppContext").then(() => {
        // Field update handled in ChatInput
      });
    }

    setTimeout(() => advanceQuestion(), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isAI ? "bg-primary/20" : "bg-accent"
        }`}
      >
        {isAI ? (
          <Bot className="w-3.5 h-3.5 text-primary" />
        ) : (
          <User className="w-3.5 h-3.5 text-accent-foreground" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] space-y-2 ${isAI ? "" : "text-right"}`}>
        <div
          className={`inline-block px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
            isAI
              ? "bg-surface-2 text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Quick Replies */}
        {message.type === "quick-reply" && message.options && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.options.map((opt) => (
              <Button
                key={opt.value}
                variant="outline"
                size="sm"
                className="text-xs h-7 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => handleQuickReply(opt.value, opt.label)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        {/* Select Options */}
        {message.type === "select" && message.options && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.options.map((opt) => (
              <Button
                key={opt.value}
                variant="outline"
                size="sm"
                className="text-xs h-7 border-border/50 text-foreground hover:bg-accent"
                onClick={() => handleSelectOption(opt.value, opt.label)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-muted-foreground font-mono px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}
