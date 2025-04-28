import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFlowDto, CreateFlowSchema, UpdateFlowDto } from './schema';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FlowService {

  constructor(
    private readonly service: PrismaService,
  ) { }
  async create(createFlowDto: CreateFlowDto) {
    try {
      const parsed = CreateFlowSchema.safeParse(createFlowDto);

      if (!parsed.success) {
        throw new BadRequestException(parsed.error.format());
      }

      const data = parsed.data as Prisma.FlowUncheckedCreateInput;

      return await this.service.flow.create({ data });
    } catch (error) {
      throw error
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [flows, total] = await this.service.$transaction([
      this.service.flow.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.service.flow.count(),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      flows,
    };
  }

  findOne(id: number) {
    return this.service.flow.findFirstOrThrow({ where: { id } });
  }

  async update(id: number, updateFlowDto: UpdateFlowDto) {
    try {
      const [_, updated] = await this.service.$transaction([
        this.service.flow.findUniqueOrThrow({ where: { id } }),
        this.service.flow.update({
          where: { id },
          data: updateFlowDto,
        })
      ])
      return updated
    } catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      const [_, removed] = await this.service.$transaction([
        this.service.flow.findUniqueOrThrow({ where: { id } }),
        this.service.flow.delete({
          where: { id }
        })
      ])
      return removed
    } catch (error) {
      throw error
    }
  }
}
