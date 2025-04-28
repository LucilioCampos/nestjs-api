export class CreateJobDto {
  id: number;
  messageId: number;
  stepId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CreateJobDto>) {
    Object.assign(this, partial);
  }
}
