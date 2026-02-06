import TopNav from "@/components/layout/TopNav";
import SplitLayout from "@/components/layout/SplitLayout";
import { AppProvider } from "@/context/AppContext";

export default function Index() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNav />
        <SplitLayout />
      </div>
    </AppProvider>
  );
}
