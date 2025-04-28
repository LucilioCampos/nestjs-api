import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './schema';

export interface FindAllQueryPros {
  page?: number
  limit?: number
  accessType?: string | null
  role?: string | null
  department?: string | null
}
@Injectable()
export class UsersService {
  constructor(private readonly service: PrismaService) { }
  async create(userDto: CreateUserDto & { departmentIds?: number[] }): Promise<User> {
    const { departmentIds = [], ...userData } = userDto;

    const query = { ...(userData as Prisma.UserUncheckedCreateInput) }
    if (departmentIds.length > 0) {
      query.departments = {
        create: departmentIds.map((id) => ({
          department: {
            connect: { id },
          },
        })),
      }
    }
    try {
      return await this.service.user.create({
        data: query,
        include: {
          departments: true
        },
      });
    } catch (error) {
      throw error
    }
  }

  async findAll({ page, limit, role, department, accessType }: FindAllQueryPros) {
    const skip = (page - 1) * limit;
    const deparmentFilters = await this.service.department.findMany({
      select: {
        id: true,
        name: true
      }
    })

    const where: any = {}
    const filters: any = {
      accessType: [
        {
          value: true,
          title: "Admin"
        },
        {
          value: false,
          title: "User"
        }
      ],
      role: [
        {
          value: true,
          title: "Can Write"
        },
        {
          value: false,
          title: "Can Read"
        }
      ],
      departments: deparmentFilters.map((dep) => ({
        value: dep.id,
        title: dep.name
      }))
    }

    if (accessType !== null) {
      where.canWrite = accessType === "true"
    }
    if (department !== null) {
      where.departments = {
        some: {
          departmentId: +department
        }
      }
    }
    if (role !== null) {
      where.isAdmin = role === "true"
    }

    const [users, total] = await this.service.$transaction([
      this.service.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          departments: {
            select: {
              department: {
                omit: {
                  createdAt: true,
                  updatedAt: true
                }
              },
            }
          }
        }
      }),
      this.service.user.count(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters,
      users,
    };
  }


  findOne(id: number) {
    return this.service.user.findUnique({ where: { id } }); // ✅ Ensure this.prisma is available
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { departmentIds = [], ...userData } = updateUserDto;

      const query: Prisma.UserUpdateInput = {
        ...(userData as Prisma.UserUpdateInput),
        departments: {
          deleteMany: {},
          create: departmentIds.map((departmentId) => ({
            department: { connect: { id: departmentId } },
          })),
        },
      };
      await this.service.user.findUniqueOrThrow({ where: { id } });
      return await this.service.user.update({
        where: { id },
        data: query,
        include: {
          departments: true
        },
      });

    } catch (error) {
      Logger.error(error, 'UPDATE USER');
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.service.user.findUniqueOrThrow({ where: { id } });
      return await this.service.user.delete({ where: { id } });
    } catch (error) {
      Logger.error(error, 'DELETE USER');
      return error;
    }
  }

  async addUserDepartment(userId: number, departmentId: number) {
    const [user, department] = await this.service.$transaction([
      this.service.user.findFirstOrThrow({ where: { id: userId } }),
      this.service.userDepartment.findFirst(({
        where: {
          userId,
          departmentId
        }
      })),

    ])

    if (department) {
      throw new BadRequestException(
        `User with id: ${department.userId} already has access to department with id: ${department.departmentId}`
      )
    }
    return await this.service.userDepartment.create({
      data: {
        userId,
        departmentId
      }
    })
  }

  async removeUserDeparment(userId: number, departmentId: number) {
    const [_user, department] = await this.service.$transaction([
      this.service.user.findFirstOrThrow({ where: { id: userId } }),
      this.service.userDepartment.findFirst(({
        where: {
          userId,
          departmentId
        }
      })),
    ])

    if (!department) {
      throw new BadRequestException(
        `User with id: ${department.userId} don't have access to department with id: ${department.departmentId}`
      )
    }

    return await this.service.userDepartment.delete({
      where: {
        userId_departmentId: {
          departmentId: departmentId,
          userId: userId
        }
      }
    })
  }
  async getDepartmentsByUserId(id: number) {
    const { departments } = await this.service.user.findUnique({
      where: { id },
      include: {
        departments: {
          take: 10
        }
      }
    })

    return departments
  }

}
