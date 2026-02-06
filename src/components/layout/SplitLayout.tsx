import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ChatPanel from "@/components/chat/ChatPanel";
import RightPanel from "@/components/right-panel/RightPanel";

export default function SplitLayout() {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={38} minSize={28} maxSize={55}>
        <ChatPanel />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />
      <ResizablePanel defaultSize={62} minSize={40}>
        <RightPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
