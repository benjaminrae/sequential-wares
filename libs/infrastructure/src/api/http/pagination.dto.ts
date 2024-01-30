import { Direction } from '@app/core/shared/query';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto<Entity> {
  @ApiProperty({ type: Number, default: 10 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Type(() => Number)
  offset: number;

  @ApiProperty({
    type: String,
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  order: Direction;

  @ApiProperty({ type: String, default: 'createdAt' })
  @IsOptional()
  orderBy: keyof Entity;
}
