import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { CreateMessageDto } from './schema';
import { MessageService } from './message.service';
import { MessageSwagger } from './swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("messages")
@Controller('api/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  @MessageSwagger.create()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }

  @Get()
  @MessageSwagger.findAll()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10',) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    return this.messageService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @MessageSwagger.find()
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  @MessageSwagger.update()
  update(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  @MessageSwagger.delete()
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
