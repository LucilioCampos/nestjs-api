// message.schema.ts
import { z } from 'zod';

export const CreateMessageSchema = z.object({
    origin: z.string(),
    body: z.string(),
    headers: z.string().optional(),
    flowId: z.number(),
});

export type CreateMessageDto = z.infer<typeof CreateMessageSchema>;
