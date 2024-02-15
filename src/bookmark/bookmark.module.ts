import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BookmarkController],
  exports: [BookmarkService],
  providers: [BookmarkService],
})
export class BookmarkModule {}
