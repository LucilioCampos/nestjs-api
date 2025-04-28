import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './schema';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeparmentService {
  constructor(
    private readonly service: PrismaService,
  ) { }
  async create(createDeparmentDto: CreateDepartmentDto) {
    try {
      const deparment = await this.service.department.create({
        data: createDeparmentDto as Prisma.DepartmentUncheckedCreateInput,
      });
      return deparment;
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const department = await this.service.department.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });

    const totalUsers = await this.service.user.count();

    return {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      department,
    };
  }

  findOne(id: number) {
    return this.service.department.findFirstOrThrow({ where: { id } });
  }

  async update(id: number, updateDeparmentDto: UpdateDepartmentDto) {
    const [_, updated] = await this.service.$transaction([
      this.service.department.findFirst({ where: { id } }),
      this.service.department.update({
        where: { id },
        data: updateDeparmentDto
      })
    ])
    return updated
  }

  remove(id: number) {
    return `This action removes a #${id} deparment`;
  }

  async findUsers(id: number) {
    const { users } = await this.service.department.findUnique({
      where: { id },
      include: {
        users: {
          take: 10
        }
      }
    });
    return users;
  }
}
