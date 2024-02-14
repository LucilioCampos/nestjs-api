import { VtexService } from '@app/vtex';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private vtexService: VtexService) {}

  @Get('me')
  async getMe(@GetUser() user: User) {
    // await this.vtexService.search();
    return user;
  }
}
