import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  id: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;

      return ret;
    },
  },
})
export class BaseModel {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  createdAt: Date;
}
