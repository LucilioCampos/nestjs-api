import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from '.prisma/client';
import { JobsProducer } from './producer/jobs.producer';

@Injectable()
export class JobsService {
  constructor(
    private readonly service: PrismaService,
    private readonly jobProducer: JobsProducer,
  ) {}
  create(jobDto: CreateJobDto): Promise<Job> {
    return this.service.job.create({
      data: jobDto,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    await this.jobProducer.incomingJob({ test: 'teste' });
    const jobs = await this.service.job.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });

    const totalUsers = await this.service.job.count();

    return {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      jobs,
    };
  }

  findOne(id: number) {
    return this.service.job.findUnique({ where: { id } }); // ✅ Ensure this.prisma is available
  }

  async update(id: number, updateUserDto: UpdateJobDto) {
    try {
      await this.service.job.findUniqueOrThrow({ where: { id } });
      return await this.service.job.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      Logger.error(error, 'UPDATE USER');
      return error;
    }
  }

  async remove(id: number) {
    try {
      await this.service.job.findUniqueOrThrow({ where: { id } });
      return await this.service.job.delete({ where: { id } });
    } catch (error) {
      Logger.error(error, 'DELETE USER');
      return error;
    }
  }
}
