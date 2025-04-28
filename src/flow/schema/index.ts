import { z } from 'zod';
import slugify from 'slugify';

const BaseFlowSchema = z.object({
    nickname: z.string(),
    slug: z.string().optional(),
    notificationEmail: z.string().email(),
    retries: z.number(),
    headers: z.string().optional(),
});

export const CreateFlowSchema = BaseFlowSchema.transform((data) => ({
    ...data,
    slug: data.slug ?? slugify(data.nickname, { lower: true }),
}));

export const UpdateFlowSchema = BaseFlowSchema.partial().transform((data) => ({
    ...data,
    slug: data.slug ?? (data.nickname ? slugify(data.nickname, { lower: true }) : undefined),
}));

export type CreateFlowDto = z.infer<typeof CreateFlowSchema>;
export type UpdateFlowDto = z.infer<typeof UpdateFlowSchema>;

