import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { applyDecorators } from '@nestjs/common';

export class FlowSwagger {
    @ApiProperty({ example: 'Customer' })
    nickname: string;

    @ApiProperty({ example: 'customer' })
    slug?: string;

    @ApiProperty({ example: 'comercial@mycompany.com' })
    notificationEmail: string;

    @ApiProperty({ example: 3 })
    retries: number;

    @ApiProperty({ example: "{ \"Authorization\": \"Bearer abc123\" }" })
    headers: string;

    static findAll() {
        return applyDecorators(
            ApiTags('flows'),
            ApiOperation({ summary: "List all flows" }),
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
                description: 'Number of flows per page',
                example: 30,
            }),

            ApiResponse({ status: 200, description: 'Successful response' }),
        );
    }

    static create() {
        return applyDecorators(
            ApiOperation({ summary: 'Create a new user' }),
            ApiBody({ type: FlowSwagger }),
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
            ApiBody({ type: FlowSwagger }),
            ApiResponse({ status: 200, description: 'Successful response' }),
        )
    }

    static delete() {
        return applyDecorators(
            ApiOperation({ summary: 'Delete an user' }),
            ApiParam({ name: 'id', type: Number, required: true, example: 1 }),
            ApiResponse({ status: 200 }),
        )
    }

    static departments() {
        return applyDecorators(
            ApiOperation({ summary: 'Delete an user' }),
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

}