import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { VtexModule } from '@app/vtex';

@Module({
  imports: [VtexModule],
  controllers: [UserController],
})
export class UserModule {}
