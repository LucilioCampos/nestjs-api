import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { UserProcessor } from './users.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserProcessor],
  imports: [
    BullModule.registerQueue({
      name: 'users',
    }),
    BullBoardModule.forFeature({
      name: 'users',
      adapter: BullAdapter,
    }),
  ],
})
export class UsersModule {}
