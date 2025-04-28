import { z } from 'zod';

export const CreateDepartmentSchema = z.object({
    name: z.string(),
});

export type CreateDepartmentDto = z.infer<typeof CreateDepartmentSchema>;
export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export type UpdateDepartmentDto = z.infer<typeof UpdateDepartmentSchema>;
