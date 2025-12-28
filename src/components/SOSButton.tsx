import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SOSButtonProps {
  onActivate?: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onActivate }) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);
  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    setCountdown(3);

    let count = 3;
    countdownRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownRef.current!);
        triggerSOS();
      }
    }, 1000);

    holdTimerRef.current = setTimeout(() => {
      // SOS triggered after 3 seconds
    }, 3000);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    setCountdown(null);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  };

  const triggerSOS = () => {
    setIsPressed(false);
    setCountdown(null);

    // Trigger Native SOS
    try {
      import('@/plugins/sos-plugin').then(({ default: SOSPlugin }) => {
        SOSPlugin.triggerSOS({
          phone: "+918919611804",
          contacts: ["+918919611804", "+919876543210"],
          message: "URGENT: A danger has been reported by the user. Please take immediate action."
        }).then(() => {
          toast.success('SOS Activated!', {
            description: `Calling emergency services and sending location alerts...`,
            duration: 5000,
          });
        }).catch((err) => {
          console.error("SOS Error:", err);
          toast.error(`SOS Error: ${err.message || 'Unknown error'}`, { description: "Please ensure permissions are granted." });
        });
      });
    } catch (e) {
      console.error(e);
    }

    onActivate?.();
  };



  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Pulse rings */}
      {isPressed && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive/20"
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}

      <motion.button
        className="sos-button relative w-16 h-16 rounded-full flex items-center justify-center bg-red-600 text-white shadow-lg shadow-red-600/50"
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        whileTap={{ scale: 0.95 }}
        aria-label="SOS Emergency Button - Hold for 3 seconds"
      >
        {countdown !== null ? (
          <motion.span
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold"
          >
            {countdown}
          </motion.span>
        ) : (
          <Shield className="w-7 h-7" />
        )}
      </motion.button>

      {isPressed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 right-0 bg-card px-3 py-1.5 rounded-lg text-xs whitespace-nowrap"
        >
          Hold for SOS
        </motion.div>
      )}
    </div>
  );
};

export default SOSButton;
