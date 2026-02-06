import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";
import ServiceConnection from "./ServiceConnection";
import ApplicationForm from "./ApplicationForm";
import AssessmentResults from "./AssessmentResults";

export default function RightPanel() {
  const { rightPanelStage } = useAppState();

  return (
    <div className="h-full overflow-y-auto bg-surface-1">
      <AnimatePresence mode="wait">
        {rightPanelStage === "connect-services" && (
          <motion.div
            key="connect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ServiceConnection />
          </motion.div>
        )}
        {rightPanelStage === "application-form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ApplicationForm />
          </motion.div>
        )}
        {rightPanelStage === "assessment-results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <AssessmentResults />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
