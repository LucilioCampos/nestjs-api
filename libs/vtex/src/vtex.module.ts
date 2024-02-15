import { Module } from '@nestjs/common';
import { VtexService } from './vtex.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [VtexService],
  exports: [VtexService],
})
export class VtexModule {}
