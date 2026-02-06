import { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Check, Link2, Loader2, SkipForward, ArrowRight } from "lucide-react";
import type { ServiceProvider } from "@/types";

export default function ServiceConnection() {
  const { services, connectService, setRightPanelStage, advanceQuestion, currentQuestionIndex } = useAppState();
  const [connecting, setConnecting] = useState<ServiceProvider | null>(null);

  const handleConnect = async (provider: ServiceProvider) => {
    setConnecting(provider);
    // Simulate OAuth delay
    await new Promise((r) => setTimeout(r, 1800));
    connectService(provider);
    setConnecting(null);
  };

  const handleContinue = () => {
    setRightPanelStage("application-form");
    if (currentQuestionIndex < 0) {
      advanceQuestion();
    }
  };

  const connectedCount = services.filter((s) => s.status === "connected").length;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-primary">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Connect Your Financial Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Link your accounting and payment platforms so we can pull verified financial data.
            This strengthens your application and speeds up the assessment.
          </p>
        </div>

        {/* Service Cards */}
        <div className="space-y-3">
          {services.map((service, i) => {
            const isConnected = service.status === "connected";
            const isConnecting = connecting === service.provider;

            return (
              <motion.div
                key={service.provider}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`p-4 rounded-xl border transition-all ${
                  isConnected
                    ? "border-verified/30 bg-verified/5"
                    : "border-border/50 bg-card/60 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h3 className="text-sm font-medium">{service.label}</h3>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>

                  {isConnected ? (
                    <div className="flex items-center gap-1.5 text-verified">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleConnect(service.provider)}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </div>

                {/* Data points */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {service.dataPoints.map((dp) => (
                    <span
                      key={dp}
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isConnected
                          ? "bg-verified/10 text-verified"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dp}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={handleContinue}
          >
            <SkipForward className="w-3.5 h-3.5 mr-1.5" />
            Skip for now
          </Button>

          <Button
            size="sm"
            className="text-xs"
            onClick={handleContinue}
            disabled={connectedCount === 0}
          >
            Continue
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        {connectedCount > 0 && (
          <p className="text-center text-xs text-verified">
            {connectedCount} service{connectedCount > 1 ? "s" : ""} connected — verified data will be highlighted in your application
          </p>
        )}
      </div>
    </div>
  );
}
