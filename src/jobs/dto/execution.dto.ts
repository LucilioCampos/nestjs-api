export class ExecutionDto {
  id: number;
  // Add other fields of Execution here
  status: string;

  constructor(partial: Partial<ExecutionDto>) {
    Object.assign(this, partial);
  }
}
