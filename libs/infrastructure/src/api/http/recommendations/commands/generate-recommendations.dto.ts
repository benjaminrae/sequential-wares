import { IsArray, IsString } from 'class-validator';

export class GenerateRecommendationsDto {
  @IsString({ each: true })
  @IsArray()
  products: Set<string>;
}
