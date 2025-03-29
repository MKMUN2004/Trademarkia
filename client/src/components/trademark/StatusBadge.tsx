import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Define status color variants
  const statusVariants: Record<string, string> = {
    "Registered": "success",
    "Pending": "info",
    "Abandoned": "danger",
    "Cancelled": "gray",
    "Expired": "warning",
    "Opposition": "orange"
  };

  // Get variant based on status, default to 'default'
  const variant = statusVariants[status] || "default";

  return (
    <Badge variant={variant as any} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
      {status}
    </Badge>
  );
}
