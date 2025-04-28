import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowService } from './flow.service';
import { CreateFlowDto, UpdateFlowDto } from './schema';
import { FlowSwagger } from './swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('flows')
@Controller('api/flows')
export class FlowController {
  constructor(private readonly flowService: FlowService) { }

  @Post()
  @FlowSwagger.create()
  create(@Body() createFlowDto: CreateFlowDto) {
    return this.flowService.create(createFlowDto)
  }

  @Get()
  @FlowSwagger.findAll()
  findAll() {
    return this.flowService.findAll();
  }

  @Get(':id')
  @FlowSwagger.find()
  findOne(@Param('id') id: string) {
    return this.flowService.findOne(+id);
  }

  @Patch(':id')
  @FlowSwagger.update()
  update(@Param('id') id: string, @Body() updateFlowDto: UpdateFlowDto) {
    return this.flowService.update(+id, updateFlowDto);
  }

  @Delete(':id')
  @FlowSwagger.delete()
  remove(@Param('id') id: string) {
    return this.flowService.remove(+id);
  }
}
