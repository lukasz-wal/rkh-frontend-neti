import { Command } from "@filecoin-plus/core";

import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";

export type PhaseResult<A, R> =
  | { status: "approved"; data: A }
  | { status: "rejected"; data: R };

export class SubmitPhaseResultCommand<A, R> extends Command {
  constructor(
    public readonly allocatorId: string,
    public readonly phase: DatacapAllocatorPhase,
    public readonly result: PhaseResult<A, R>
  ) {
    super();
  }
}
