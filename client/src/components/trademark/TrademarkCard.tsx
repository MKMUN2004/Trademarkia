import { format } from "date-fns";
import { Link } from "wouter";
import { TrademarkWithRelations } from "@shared/schema";
import StatusBadge from "./StatusBadge";
import ClassificationBadge from "./ClassificationBadge";

interface TrademarkCardProps {
  trademark: TrademarkWithRelations;
}

export default function TrademarkCard({ trademark }: TrademarkCardProps) {
  // Format the filing date
  const formattedFilingDate = trademark.filingDate 
    ? format(new Date(trademark.filingDate), "MMM d, yyyy") 
    : "Unknown";

  // Get the status name
  const getStatusName = (statusId: number) => {
    // Map from status ID to name
    const statusMap: Record<number, string> = {
      1: "Registered",
      2: "Pending",
      3: "Abandoned",
      4: "Cancelled",
      5: "Expired",
      6: "Opposition"
    };
    
    return statusMap[statusId] || "Unknown";
  };
  
  const statusName = getStatusName(trademark.statusId);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{trademark.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Serial #{trademark.serialNumber} • Filed: {formattedFilingDate}
            </p>
          </div>
          <div>
            <StatusBadge status={statusName} />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Mark Description</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            {trademark.description || "No description available."}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Owner</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            {trademark.owner?.name || "Unknown"}
          </dd>
        </div>
        <div className="px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Classification</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            {trademark.classifications && trademark.classifications.length > 0 ? (
              <div className="flex flex-wrap">
                {trademark.classifications.map(classId => (
                  <ClassificationBadge key={classId} classificationId={classId} />
                ))}
              </div>
            ) : (
              <span className="text-gray-500">No classifications available</span>
            )}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Attorney/Law Firm</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            {trademark.attorney?.name || "Unknown"} {trademark.lawFirm ? `/ ${trademark.lawFirm.name}` : ""}
          </dd>
        </div>
        <div className="px-4 py-5 sm:px-6 flex justify-end">
          <Link href={`/trademark/${trademark.id}`}>
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              View Details
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
