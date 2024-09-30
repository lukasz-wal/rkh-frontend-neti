import React from 'react';
import { cn } from '@/lib/utils';
import { Application, ApplicationPhase, ApplicationPhaseStatus } from '@/types/application';
import { CheckCircle2, AlertCircle, Clock, XCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

const phaseDescriptions: Record<ApplicationPhase, string> = {
  SUBMISSION: 'Initial application submission phase',
  KYC: 'Know Your Customer verification process',
  GOVERNANCE_REVIEW: 'Application review by governance committee',
  RKH_APPROVAL: 'Final approval by RKH',
  DATA_CAP_GRANT: 'Granting of data cap upon successful application',
};

const phaseNames: Record<ApplicationPhase, string> = {
  SUBMISSION: 'Submit',
  KYC: 'KYC',
  GOVERNANCE_REVIEW: 'Review',
  RKH_APPROVAL: 'Approve',
  DATA_CAP_GRANT: 'Grant',
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
    <div className="flex flex-col space-y-3 w-full min-w-[200px]">
      <div className="hidden sm:block relative w-full bg-gray-200 rounded-full h-2">
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
            {index === currentPhaseIndex && (
              <div
                className="absolute -top-7 -translate-x-1/2"
                style={{ left: `${(index / (phases.length - 1)) * 100}%` }}
              >
                <Badge 
                  className={cn(
                    "text-xs font-semibold",
                    phaseColors[p],
                  )}
                >
                  {phaseNames[p]}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="ml-2">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{phaseDescriptions[phase]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </div>
            )}
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
      <div className="sm:hidden flex justify-center">
        <Badge 
          className={cn(
            "text-xs font-semibold",
            phaseColors[phase],
            'ring-2 ring-offset-2 ring-offset-white ring-gray-300'
          )}
        >
          {phaseNames[phase]}
          <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="ml-2">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{phaseDescriptions[phase]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
        </Badge>
      </div>
    </div>
  );
}