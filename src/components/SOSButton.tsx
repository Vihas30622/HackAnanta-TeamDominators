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

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          toast.success('SOS Activated!', {
            description: `Calling emergency contacts... Location sent.`,
            duration: 5000,
          });

          // Call Emergency Number
          const phoneNumber = "8919611804";
          window.location.href = `tel:${phoneNumber}`;

          // Send Email (using mailto for immediate client-side action without backend)
          const email = "2420030622@klh.edu.in";
          const subject = "SOS ALERT - DANGER REPORTED";
          const body = `URGENT: A danger has been reported by the user.\n\nLocation: ${locationLink}\n\nPlease take immediate action.`;

          // Open mail client in new window to n ot block phone call
          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        },
        () => {
          toast.success('SOS Activated!', {
            description: 'Calling emergency contacts...',
            duration: 5000,
          });

          const phoneNumber = "8919611804";
          window.location.href = `tel:${phoneNumber}`;

          // Send Email fallback (no location)
          const email = "2420030622@klh.edu.in";
          const subject = "SOS ALERT - DANGER REPORTED";
          const body = `URGENT: A danger has been reported by the user.\n\nLocation Unavailable.\n\nPlease take immediate action.`;
          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
