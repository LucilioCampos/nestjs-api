import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto, CreateMessageSchema } from './schema';
import { Prisma } from '@prisma/client';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';

@Injectable()
export class MessageService {
  constructor(
    private readonly service: PrismaService,
    private readonly jobsProducer: JobsProducer,
  ) { }
  async create(createMessageDto: CreateMessageDto) {
    try {
      const parsed = CreateMessageSchema.safeParse(createMessageDto);

      if (!parsed.success) {
        throw new BadRequestException(parsed.error.format());
      }

      const data = parsed.data as Prisma.MessageUncheckedCreateInput;
      const response = await this.service.message.create({ data });

      await this.jobsProducer.incomingJob(response)
      return response
    } catch (error) {
      throw error
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    messages: any
  }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await this.service.$transaction([
      this.service.message.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.service.message.count(),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      messages,
    };
  }

  async findOne(id: number) {
    return this.service.message.findFirstOrThrow({ where: { id } })
  }

  async update(id: number, updateMessageDto: CreateMessageDto) {
    const [_, updatedMessage] = await this.service.$transaction([
      this.service.message.findFirst({
        where: { id }
      }),
      this.service.message.update({
        where: { id },
        data: updateMessageDto
      }),
    ])
    return updatedMessage
  }

  async remove(id: number) {
    return this.service.$transaction([
      this.service.message.findFirstOrThrow({
        where: { id }
      }),
      this.service.message.delete({
        where: { id },

      }),
    ])
  }
}