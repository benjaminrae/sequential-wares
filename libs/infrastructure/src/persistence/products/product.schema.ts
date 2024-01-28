import { ProductProps } from '@app/core';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../shared/base.schema';

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema({})
export class ProductModel extends BaseModel implements ProductProps {}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
