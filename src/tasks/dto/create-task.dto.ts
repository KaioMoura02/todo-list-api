import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export enum TASKS_STATUS {
  NAO_INICIADA = 'NAO_INICIADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADA = 'FINALIZADA',
}

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  status: TASKS_STATUS;
}
