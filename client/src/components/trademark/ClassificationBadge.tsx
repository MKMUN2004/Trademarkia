import { trademarkClassifications } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ClassificationBadgeProps {
  classificationId: number;
}

export default function ClassificationBadge({ classificationId }: ClassificationBadgeProps) {
  // Find classification by ID
  const classification = trademarkClassifications.find(c => c.id === classificationId);
  
  if (!classification) {
    return null;
  }

  // Get variant based on classification color
  const variant = classification.color || "default";

  return (
    <Badge
      variant={variant as any}
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-2 mb-1"
    >
      {classification.name}
    </Badge>
  );
}
