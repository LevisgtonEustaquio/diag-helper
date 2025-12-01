import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SpinnerLucide({ size = 32, color = "text-green-600" }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      className="inline-block"
    >
      <Loader2 size={64} className={color} />
    </motion.div>
  );
}
