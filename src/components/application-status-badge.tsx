import React from 'react';
import { cn } from '@/lib/utils';
import { Application, ApplicationPhase, ApplicationPhaseStatus } from '@/types/application';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

interface ApplicationStatusBadgeProps {
  application: Application;
}

const phases: ApplicationPhase[] = [
  "SUBMISSION",
  "KYC",
  "GOVERNANCE_REVIEW",
  "RKH_APPROVAL",
  "DATA_CAP_GRANT",
];

const phaseColors: Record<ApplicationPhase, string> = {
  SUBMISSION: 'bg-purple-600',
  KYC: 'bg-blue-600',
  GOVERNANCE_REVIEW: 'bg-yellow-600',
  RKH_APPROVAL: 'bg-orange-600',
  DATA_CAP_GRANT: 'bg-green-600',
};

const statusConfig: Record<ApplicationPhaseStatus, { color: string; icon: React.ElementType; progress: number }> = {
  NOT_STARTED: { color: 'text-yellow-600', icon: Clock, progress: 0 },
  IN_PROGRESS: { color: 'text-blue-600', icon: AlertCircle, progress: 0.5 },
  COMPLETED: { color: 'text-green-600', icon: CheckCircle2, progress: 1 },
  FAILED: { color: 'text-red-600', icon: XCircle, progress: 1 },
};

export function ApplicationStatusBadge({ application }: ApplicationStatusBadgeProps) {
  const { phase, phaseStatus } = application.status;
  const currentPhaseIndex = phases.indexOf(phase);
  const StatusIcon = statusConfig[phaseStatus].icon;

  const getPhaseProgress = (index: number) => {
    if (index < currentPhaseIndex) return 1;
    if (index > currentPhaseIndex) return 0;
    return statusConfig[phaseStatus].progress;
  };

  return (
    <div className="flex flex-col space-y-3 w-full max-w-md">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{phase.replace('_', ' ')}</span>
        <div className="flex items-center space-x-1">
          <StatusIcon className={`w-4 h-4 ${statusConfig[phaseStatus].color}`} />
          <span className={`text-xs font-semibold ${statusConfig[phaseStatus].color}`}>
            {phaseStatus.charAt(0).toUpperCase() + phaseStatus.slice(1).toLowerCase()}
          </span>
        </div>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        {phases.map((p, index) => (
          <React.Fragment key={p}>
            <div
              className={cn(
                "absolute h-2 rounded-full",
                index <= currentPhaseIndex ? phaseColors[p] : 'bg-gray-300'
              )}
              style={{
                left: `${(index / (phases.length - 1)) * 100}%`,
                width: `${100 / (phases.length - 1)}%`,
                transform: `scaleX(${getPhaseProgress(index)})`,
                transformOrigin: 'left',
                transition: 'transform 0.3s ease-in-out'
              }}
            ></div>
            <div
              className={cn(
                "absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 border-2 border-white",
                index <= currentPhaseIndex ? phaseColors[p] : 'bg-gray-300'
              )}
              style={{ left: `calc(${(index / (phases.length - 1)) * 100}% - 6px)` }}
            ></div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}