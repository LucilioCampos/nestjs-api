import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VtexService {
  private readonly logger = new Logger(VtexService.name);
  constructor(private readonly httpService: HttpService) {}

  async search(): Promise<any> {
    this.logger.log('[SEARCH]');
    return firstValueFrom(
      this.httpService.get('http://localhost:3333/users/me', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIiwiaWF0IjoxNzA2MTMzNzY4LCJleHAiOjE3MDYxMzQ2Njh9.n8jjbDuDNvAa-AZl-Dtx9W91EWHr5VE5BtsMjHb3wo4',
        },
      }),
    );
  }
}
