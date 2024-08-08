import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const TokenIndicator = ({ currentTokensAmount, maxTokens } : {currentTokensAmount: number, maxTokens: number}) => {
  const progress = Math.min(currentTokensAmount / maxTokens, 1); // Ensure progress does not exceed 100%
  const strokeDashoffset = 440 - (440 * progress); // Assuming the SVG circle has a circumference of 440

  return (
    <div className="flex items-center justify-center">
      <svg className="w-16 h-16" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#eaeaea"
          strokeWidth="5"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#0078D4"
          strokeWidth="5"
          strokeDasharray="440" // Circumference of the circle
          strokeDashoffset={strokeDashoffset}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            loop: Infinity,
            ease: "linear",
            duration: 2,
          }}
        />
      </svg>
      <div className="absolute">
        <Loader2 className="animate-spin" size={64} color="#0078D4" />
        <div className="text-center mt-2 text-sm font-semibold">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
};

export default TokenIndicator;
