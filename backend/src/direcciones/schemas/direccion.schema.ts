import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Esquema de Mongoose que define la estructura de documentos de direcciones en MongoDB
@Schema({ collection: 'direcciones' })
export class Direccion extends Document {
  // Código postal (campo obligatorio, tipo numérico)
  @Prop({ required: true })
  d_codigo: number;

  // Nombre del asentamiento o colonia (campo obligatorio)
  @Prop({ required: true })
  d_asenta: string;

  // Tipo de asentamiento (colonia, fraccionamiento, etc.) (campo obligatorio)
  @Prop({ required: true })
  d_tipo_asenta: string;

  // Nombre del municipio (campo obligatorio)
  @Prop({ required: true })
  D_mnpio: string;

  // Nombre del estado (campo obligatorio)
  @Prop({ required: true })
  d_estado: string;

  // Nombre de la ciudad (campo obligatorio)
  @Prop({ required: true })
  d_ciudad: string;
}

// Exportar el esquema generado para uso en el módulo
export const DireccionSchema = SchemaFactory.createForClass(Direccion);