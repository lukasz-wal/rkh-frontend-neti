import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon?: React.ReactNode;
}

interface TimelinePhase {
  [key: string]: TimelineEvent[];
}

interface TimelineEventProps {
  event: TimelineEvent;
  isLast: boolean;
}

interface TimelinePhaseProps {
  phase: string;
  events: TimelineEvent[];
}

interface ApplicationTimelineProps {
  phases: TimelinePhase;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, isLast }) => (
  <li className={cn("mb-10 ms-6")}>
    <div className="relative">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-9 ring-8 ring-white">
        {event.icon || <Calendar />}
      </span>
      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
        {event.title}
      </h3>
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
        {event.date}
      </time>
      <p className="mb-4 text-base font-normal text-gray-500">
        {event.description}
      </p>
    </div>
    {/* TODO: !isLast && <div className="absolute w-0.5 bg-gray-200 h-full -start-3 top-6" /> */}
  </li>
);

const TimelinePhase: React.FC<TimelinePhaseProps> = ({ phase, events }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{phase}</h2>
    <ol className="relative border-s border-gray-200 ms-3">
      {events.map((event, index) => (
        <TimelineEvent
          key={`${phase}-${event.title}-${index}`}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </ol>
  </div>
);

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  phases,
}) => (
  <div className="container mx-auto p-4">
    {Object.entries(phases).map(([phase, events]) => (
      <TimelinePhase key={phase} phase={phase} events={events} />
    ))}
  </div>
);

export default ApplicationTimeline;
