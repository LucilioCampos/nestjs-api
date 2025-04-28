import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateUserSchema = z.object({
    email: z.string().email(),
    username: z.string().optional(),
    isAdmin: z.boolean().optional().default(false),
    canWrite: z.boolean().optional().default(false),
    departmentIds: z.array(z.number()).optional()
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;



export class CreateUserDtoSwagger {
    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: 'john_doe' })
    username: string;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    canWrite: boolean;
}
