import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direccion } from './schemas/direccion.schema';

// Servicio que contiene la lógica de negocio para el manejo de direcciones y códigos postales
@Injectable()
export class DireccionesService {
  // Inyección del modelo de Mongoose para realizar operaciones con MongoDB
  constructor(
    @InjectModel(Direccion.name) private readonly direccionModel: Model<Direccion>,
  ) {}

  // Método para buscar todas las colonias y el municipio asociados a un código postal específico
  async findColoniasYMunicipioPorCodigoPostal(d_codigo: number) {
    // Buscar todas las direcciones que coincidan con el código postal proporcionado
    const direcciones = await this.direccionModel.find({ d_codigo }).exec();
    
    // Extraer los nombres de las colonias de los resultados encontrados
    const colonias = direcciones.map(d => d.d_asenta);
    
    // Obtener el nombre del municipio del primer resultado (todos deberían tener el mismo municipio)
    const municipio = direcciones[0]?.D_mnpio || '';
    
    // Retornar un objeto con las colonias y el municipio encontrados
    return { colonias, municipio };
  }

  // Método para obtener todas las direcciones (limitado a 100 registros para evitar sobrecarga)
  async findAll() {
    return this.direccionModel.find().limit(100).exec();
  }
}