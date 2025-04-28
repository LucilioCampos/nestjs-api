import { MessageDto } from './message.dto';
import { StepDto } from './step.dto';
import { ExecutionDto } from './execution.dto';

export class JobDto {
  id: number;
  messageId: number;
  stepId: number;
  createdAt: Date;
  updatedAt: Date;

  message: MessageDto;
  step: StepDto;
  executions: ExecutionDto[];

  constructor(partial: Partial<JobDto>) {
    Object.assign(this, partial);

    if (partial.message) {
      this.message = new MessageDto(partial.message);
    }

    if (partial.step) {
      this.step = new StepDto(partial.step);
    }

    if (partial.executions) {
      this.executions = partial.executions.map(
        (execution) => new ExecutionDto(execution),
      );
    }
  }
}
