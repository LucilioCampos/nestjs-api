import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { applyDecorators } from '@nestjs/common';


export class UserSwagger {
    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: 'john_doe' })
    username: string;

    @ApiProperty({ example: true })
    isAdmin: boolean;

    @ApiProperty({ example: false })
    canWrite: boolean;

    @ApiProperty({ example: [1, 4, 8] })
    departmentIds: number[];

    static findAll() {
        return applyDecorators(
            ApiTags('users'),
            ApiOperation({ summary: "List all users" }),
            ApiQuery({
                name: 'page',
                required: false,
                type: Number,
                description: 'Page number for pagination',
                example: 1,
            }),
            ApiQuery({
                name: 'limit',
                required: false,
                type: Number,
                description: 'Number of users per page',
                example: 30,
            }),
            ApiQuery({
                name: 'deparment',
                required: false,
                type: Number,
                description: 'User Deparment ID',
                example: 1,
            }),

            ApiQuery({
                name: 'accessType',
                required: false,
                type: Boolean,
                description: 'Type of user access, ex: (canRead == false, canWrite == true)',
                example: false,
            }),
            ApiQuery({
                name: 'role',
                required: false,
                type: Boolean,
                description: 'Type of permission for overall application, ex: (isAdmin == true, isUser == false)',
                example: false,
            }),
            ApiResponse({ status: 200, description: 'Successful response' }),
        );
    }

    static create() {
        return applyDecorators(
            ApiOperation({ summary: 'Create a new user' }),
            ApiBody({ type: UserSwagger }),
            ApiResponse({ status: 201, description: 'Successful response' }),
        )
    }

    static find() {
        return applyDecorators(
            ApiOperation({ summary: 'Finds an user' }),
            ApiParam({ name: 'userId', type: Number, required: true, example: 1 }),
            ApiResponse({ status: 200, description: 'Successful response' }),
        )
    }

    static update() {
        return applyDecorators(
            ApiOperation({ summary: 'Update an user' }),
            ApiParam({ name: 'id', type: Number, required: true, example: 1 }),
            ApiBody({ type: UserSwagger }),
            ApiResponse({ status: 200, description: 'Successful response' }),
        )
    }

    static delete() {
        return applyDecorators(
            ApiOperation({ summary: 'Delete an user' }),
            ApiParam({ name: 'id', type: Number, required: true, example: 1 }),
            ApiResponse({ status: 204 }),
        )
    }

    static departments() {
        return applyDecorators(
            ApiOperation({ summary: 'Get departments from an user' }),
            ApiParam({ name: 'id', type: Number, required: true, example: 1 }),
            ApiResponse({
                status: 200,
                example: [
                    {
                        "flowId": 42,
                        "departmentId": 1,
                        "name": "Comercial",
                        "createdAt": "2025-03-05T14:00:00.000Z",
                        "updatedAt": "2025-04-01T10:30:00.000Z",
                        "flow": {
                            "id": 42,
                            "name": "Customers",
                            "version": "v1.0",
                            "createdAt": "2025-01-01T08:00:00.000Z",
                            "updatedAt": "2025-02-15T11:00:00.000Z"
                        }
                    }
                ]
            }),
        )
    }

    static addDepartment() {
        return applyDecorators(
            ApiOperation({ summary: 'Add department to an user' }),
            ApiParam({ name: 'userId', type: Number, required: true, example: 1 }),
            ApiParam({ name: 'departmentId', type: Number, required: true, example: 1 }),
            ApiResponse({ status: 201 }),
        )
    }

    static deleteDeparment() {
        return applyDecorators(
            ApiOperation({ summary: "Deletes department from an user" }),
            ApiParam({ name: 'userId', type: Number, required: true, example: 1 }),
            ApiParam({ name: 'departmentId', type: Number, required: true, example: 1 }),
            ApiResponse({ status: 204 }),
        )
    }

}