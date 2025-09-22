import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, TASKS_STATUS } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserService } from 'src/user/user.service';
import { ListTaskDto } from './dto/list-task.dto';

@Injectable()
export class TasksService {
  @Inject()
  private readonly prisma: PrismaService;

  @Inject()
  private readonly userService: UserService;

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<CreateTaskDto> {
    const taskCreated = await this.prisma.task.create({
      data: { ...createTaskDto, userId },
    });

    return this.buildTask(taskCreated);
  }

  async findAll(userId: string): Promise<ListTaskDto[]> {
    const tasks = await this.prisma.task.findMany({ where: { userId } });

    return tasks.map((task) => this.buildTask(task));
  }

  async findOne(id: string): Promise<ListTaskDto> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return this.buildTask(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<CreateTaskDto> {
    const task = await this.findOne(id);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return this.buildTask(updatedTask);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const task = await this.findOne(id);

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    try {
      await this.prisma.task.delete({ where: { id } });
    } catch {
      return { success: false };
    }

    return { success: true };
  }

  private buildTask(task: any): ListTaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: TASKS_STATUS[task.status],
      endDate: task.end_date,
    };
  }
}
