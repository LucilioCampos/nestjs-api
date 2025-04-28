import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { applyDecorators } from '@nestjs/common';

export class Integration {
    @ApiProperty({ example: 'customer' })
    service: string;

    @ApiProperty({
        example: "{ \"test\": \"1234\" }"
    })
    content: string;

    static create() {
        return applyDecorators(
            ApiOperation({ summary: 'Creates a new integration message' }),
            ApiBody({ type: Integration }),
            ApiResponse({ status: 201, description: 'Successful response' }),
        )
    }



}