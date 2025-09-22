import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { UserModule } from 'src/user/user.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [UserModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
