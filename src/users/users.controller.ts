import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateUserDto, UpdateUserDto } from './schema';
import { ApiTags } from '@nestjs/swagger';
import { UserSwagger } from './swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectQueue('users') private emailQueue: Queue,
  ) { }


  @Post()
  @UserSwagger.create()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  @Get()
  @UserSwagger.findAll()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('department') department = null,
    @Query('role') role = null,
    @Query('accessType') accessType = null,
  ) {
    // Convert string query params to numbers safely
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    return this.usersService.findAll({
      page: pageNum,
      limit: limitNum,
      department,
      role,
      accessType
    });
  }

  @Get(':id')
  @UserSwagger.find()
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UserSwagger.update()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) throw new BadRequestException('Invalid ID format');
    return this.usersService.update(userId, updateUserDto);
  }


  @Delete(':id')
  @UserSwagger.delete()
  async remove(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.usersService.remove(userId);
  }

  @Get(':id/departments')
  @UserSwagger.departments()
  async getDepartmentsByUserId(@Param('id') id: number) {

    return await this.usersService.getDepartmentsByUserId(+id);
  }

  @Post(':id/departments/:departmentId')
  @UserSwagger.addDepartment()
  async addUserDepartment(@Param('id') id: number, @Param('id') departmentId: number,) {
    return await this.usersService.addUserDepartment(+id, +departmentId);
  }

  @Delete(':id/departments/:departmentId')
  @UserSwagger.deleteDeparment()
  async removeUserDeparment(@Param('id') id: number, @Param('id') departmentId: number,) {
    return await this.usersService.removeUserDeparment(+id, +departmentId);
  }
}
