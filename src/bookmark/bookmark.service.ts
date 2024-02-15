import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookmarkService {
  private readonly logger = new Logger(BookmarkService.name);
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.defaults.baseURL =
      'https://pitstop.vteximg.com.br';
  }

  async getFile(): Promise<string[]> {
    this.logger.log(`[VTEX FILE]`);
    const response = await this.httpService.axiosRef.get(
      '/arquivos/result.json.css',
    );
    return response.data;
  }
}
