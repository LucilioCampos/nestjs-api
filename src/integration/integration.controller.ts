import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { ApiTags } from "@nestjs/swagger";
import { Integration } from "./swagger";

@ApiTags('integrations')
@Controller('api/integrations')
export class IntegrationController {
    constructor(private readonly integrationService: IntegrationService) { }

    @Post()
    @Integration.create()
    create(@Body() integrationBody: Record<string, any>) {
        if (!integrationBody.service) {
            throw new BadRequestException(["Service is required!"])
        }
        return this.integrationService.execute(integrationBody)
    }
}