import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export default function SpinnerLucide({ color = "text-green-600" }) {
  return (
    <div className="inline-block animate-spin">
      <Loader2 size={64} className={color} />
    </div>
  );
}

SpinnerLucide.propTypes = {
  color: PropTypes.string,
};
