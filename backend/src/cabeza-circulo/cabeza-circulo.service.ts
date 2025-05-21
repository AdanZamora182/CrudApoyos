import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Método para obtener todas las cabezas de círculo
  async findAll(): Promise<CabezaCirculo[]> {
    return await this.cabezaCirculoRepo.find();
  }

  // Método para buscar una cabeza de círculo por ID
  async findOne(id: number): Promise<CabezaCirculo> {
    const cabeza = await this.cabezaCirculoRepo.findOne({ where: { id } });
    if (!cabeza) {
      throw new NotFoundException(`Cabeza de Círculo con ID ${id} no encontrada`);
    }
    return cabeza;
  }

  // Método para actualizar una cabeza de círculo
  async update(id: number, cabezaData: Partial<CabezaCirculo>): Promise<CabezaCirculo> {
    const cabeza = await this.findOne(id);
    
    // Asegurar que la fecha de nacimiento sea un objeto Date si viene como string
    if (cabezaData.fechaNacimiento && typeof cabezaData.fechaNacimiento === 'string') {
      cabezaData.fechaNacimiento = new Date(cabezaData.fechaNacimiento);
    }
    
    Object.assign(cabeza, cabezaData);
    return await this.cabezaCirculoRepo.save(cabeza);
  }

  // Método para eliminar una cabeza de círculo
  async remove(id: number): Promise<void> {
    const result = await this.cabezaCirculoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cabeza de Círculo con ID ${id} no encontrada`);
    }
  }

  // Método para buscar Cabezas de Círculo por nombre o Clave_Elector
  async buscar(query: string): Promise<CabezaCirculo[]> {
    // Si no hay query, retornar todas las cabezas de círculo
    if (!query || query.trim() === '') {
      return await this.findAll();
    }
    
    return this.cabezaCirculoRepo
      .createQueryBuilder('cabezaCirculo')
      .where('cabezaCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}