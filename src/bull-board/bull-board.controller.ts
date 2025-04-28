import { Controller, Get, Req, Res } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { Request, Response } from 'express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

@Controller()
export class BullBoardController {
  @Get()
  @Get('*path')
  async show(@Req() req: Request, @Res() res: Response) {
    return serverAdapter.getRouter()(req, res);
  }
}
