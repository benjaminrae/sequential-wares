import { RecommendationsProps } from '@app/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../shared/base.schema';

export type RecommendationsDocument = HydratedDocument<RecommendationsModel>;

@Schema({})
export class RecommendationsModel
  extends BaseModel
  implements Omit<RecommendationsProps, 'originalProducts'>
{
  @Prop({ required: true, type: [[String]] })
  recommendedProducts: string[][];
}

export const RecommendationsSchema =
  SchemaFactory.createForClass(RecommendationsModel);
