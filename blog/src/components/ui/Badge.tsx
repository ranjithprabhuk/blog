import { Link } from "react-router-dom";

interface BadgeProps {
  label: string;
  to?: string;
  variant?: "default" | "primary";
}

export default function Badge({ label, to, variant = "default" }: BadgeProps) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors";
  const variants = {
    default:
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
    primary:
      "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50",
  };

  const className = `${base} ${variants[variant]}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
