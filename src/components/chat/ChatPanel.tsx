import { useRef, useEffect, useState } from "react";
import { useAppState } from "@/context/AppContext";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";

export default function ChatPanel() {
  const { messages, currentQuestionIndex, interviewComplete, application } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  const completionPercent = application.completionPercent ?? 0;
  const isInterviewStarted = currentQuestionIndex >= 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium">AI Interview</span>
          </div>
          {isInterviewStarted && (
            <span className="text-[10px] font-mono text-muted-foreground">
              {completionPercent}% complete
            </span>
          )}
        </div>
        {isInterviewStarted && (
          <Progress value={completionPercent} className="h-1" />
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {showTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput setShowTyping={setShowTyping} />
    </div>
  );
}
