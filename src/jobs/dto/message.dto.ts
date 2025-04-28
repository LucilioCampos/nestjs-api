export class MessageDto {
  id: number;
  // Add other fields of Message here
  content: string;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}
