import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'direcciones' })
export class Direccion extends Document {
  @Prop({ required: true })
  d_codigo: number;

  @Prop({ required: true })
  d_asenta: string;

  @Prop({ required: true })
  d_tipo_asenta: string;

  @Prop({ required: true })
  D_mnpio: string;

  @Prop({ required: true })
  d_estado: string;

  @Prop({ required: true })
  d_ciudad: string;
}

export const DireccionSchema = SchemaFactory.createForClass(Direccion);