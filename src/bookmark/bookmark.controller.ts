import { Controller, Get } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get('/')
  async getFile() {
    // await this.vtexService.search();
    return this.bookmarkService.getFile();
  }
}
