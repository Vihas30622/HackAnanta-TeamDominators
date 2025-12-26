import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';

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
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast.success('SOS Activated!', {
            description: `Emergency contacts notified. Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            duration: 5000,
          });
          
          // Mock call to emergency number
          // In production: window.location.href = 'tel:+1234567890';
        },
        () => {
          toast.success('SOS Activated!', {
            description: 'Emergency contacts notified. Location unavailable.',
            duration: 5000,
          });
        }
      );
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
        className="sos-button relative w-16 h-16 rounded-full flex items-center justify-center text-destructive-foreground"
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
