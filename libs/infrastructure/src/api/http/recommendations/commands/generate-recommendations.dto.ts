import { IsArray, IsString } from 'class-validator';

export class GenerateRecommendationsDto {
  @IsString({ each: true })
  @IsArray()
  readonly products: Set<string>;
}
