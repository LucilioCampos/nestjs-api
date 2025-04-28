import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { applyDecorators } from '@nestjs/common';
import { IsInt, IsOptional, IsString } from "class-validator";

export class MessageSwagger {
    @ApiProperty({ example: 'Origin host' })
    @IsString()
    origin: string;

    @ApiProperty({
        example: `{ \"service\": \"[Flow slug]\", \"content\": \"{ \"test\": \"1234\"} }`
    })
    @IsString()
    body: string;

    @ApiProperty({ example: "{ \"Authorization\": \"Bearer abc123\" }" })
    @IsOptional()
    @IsString()
    headers?: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    flowId: number;

    static findAll() {
        return applyDecorators(
            ApiTags('messages'),
            ApiOperation({ summary: "List all messages" }),
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
                description: 'Number of messages per page',
                example: 30,
            }),

            ApiResponse({ status: 200, description: 'Successful response' }),
        );
    }

    static create() {
        return applyDecorators(
            ApiOperation({ summary: 'Create a new user' }),
            ApiBody({ type: MessageSwagger }),
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
            ApiBody({ type: MessageSwagger }),
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
}