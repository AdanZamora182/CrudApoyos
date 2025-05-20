import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabezaCirculo } from './cabeza-circulo.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CabezaCirculoService {
  constructor(
    @InjectRepository(CabezaCirculo)
    private readonly cabezaCirculoRepo: Repository<CabezaCirculo>,
  ) {}

  // Método para crear una nueva Cabeza de Círculo
  async create(cabezaCirculoData: CabezaCirculo): Promise<CabezaCirculo> {
    try {
      const nuevaCabezaCirculo = this.cabezaCirculoRepo.create(cabezaCirculoData);
      return await this.cabezaCirculoRepo.save(nuevaCabezaCirculo);
    } catch (error) {
      console.error("Error en el servicio:", error);
      throw error;
    }
  }

  // Método para buscar Cabezas de Círculo por nombre o Clave_Elector
  async buscar(query: string): Promise<CabezaCirculo[]> {
    return this.cabezaCirculoRepo
      .createQueryBuilder('cabezaCirculo')
      .select([
        'cabezaCirculo.id',
        'cabezaCirculo.nombre',
        'cabezaCirculo.apellidoPaterno',
        'cabezaCirculo.apellidoMaterno',
        'cabezaCirculo.claveElector',
      ]) // Explicitly select required fields
      .where('cabezaCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}