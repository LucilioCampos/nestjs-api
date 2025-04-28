import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeparmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './schema';

@Controller('api/departments')
export class DeparmentController {
  constructor(private readonly deparmentService: DeparmentService) { }

  @Post()
  create(@Body() createDeparmentDto: CreateDepartmentDto) {
    return this.deparmentService.create(createDeparmentDto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    return this.deparmentService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deparmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeparmentDto: UpdateDepartmentDto,
  ) {
    return this.deparmentService.update(+id, updateDeparmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deparmentService.remove(+id);
  }
  @Get(':id/users')
  findUserByDeparment(@Param('id') id: string) {
    return this.deparmentService.findUsers(+id);
  }
}
