import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direccion } from './schemas/direccion.schema';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectModel(Direccion.name) private readonly direccionModel: Model<Direccion>,
  ) {}

  // Buscar colonias y municipio por código postal
  async findColoniasYMunicipioPorCodigoPostal(d_codigo: number) {
    const direcciones = await this.direccionModel.find({ d_codigo }).exec();
    const colonias = direcciones.map(d => d.d_asenta);
    const municipio = direcciones[0]?.D_mnpio || '';
    return { colonias, municipio };
  }

  // Obtener todos (prueba)
  async findAll() {
    return this.direccionModel.find().limit(100).exec();
  }
}