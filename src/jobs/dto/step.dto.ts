export class StepDto {
  id: number;
  // Add other fields of Step here
  name: string;

  constructor(partial: Partial<StepDto>) {
    Object.assign(this, partial);
  }
}
