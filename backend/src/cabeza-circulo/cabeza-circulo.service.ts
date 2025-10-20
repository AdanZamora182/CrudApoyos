import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabezaCirculo } from './cabeza-circulo.entity';
import { lastValueFrom } from 'rxjs';

// Servicio que contiene la lógica de negocio para la gestión de cabezas de círculo
@Injectable()
export class CabezaCirculoService {
  // Inyección del repositorio de cabeza de círculo para operaciones con la base de datos
  constructor(
    @InjectRepository(CabezaCirculo)
    private readonly cabezaCirculoRepo: Repository<CabezaCirculo>,
  ) {}

  // Método para crear y guardar una nueva cabeza de círculo en la base de datos
  async create(cabezaCirculoData: CabezaCirculo): Promise<CabezaCirculo> {
    try {
      // Crear una nueva instancia de cabeza de círculo con los datos recibidos
      const nuevaCabezaCirculo = this.cabezaCirculoRepo.create(cabezaCirculoData);
      // Guardar la cabeza de círculo en la base de datos y retornarla
      return await this.cabezaCirculoRepo.save(nuevaCabezaCirculo);
    } catch (error) {
      console.error("Error en el servicio:", error);
      throw error;
    }
  }

  // Método para obtener todas las cabezas de círculo registradas
  async findAll(): Promise<CabezaCirculo[]> {
    return await this.cabezaCirculoRepo.find();
  }

  // Método para buscar una cabeza de círculo específica por su ID
  async findOne(id: number): Promise<CabezaCirculo> {
    const cabeza = await this.cabezaCirculoRepo.findOne({ where: { id } });
    // Lanzar excepción si no se encuentra la cabeza de círculo
    if (!cabeza) {
      throw new NotFoundException(`Cabeza de Círculo con ID ${id} no encontrada`);
    }
    return cabeza;
  }

  // Método para actualizar una cabeza de círculo existente
  async update(id: number, cabezaData: Partial<CabezaCirculo>): Promise<CabezaCirculo> {
    // Buscar la cabeza de círculo existente (lanza excepción si no existe)
    const cabeza = await this.findOne(id);
    
    // Convertir fecha de string a objeto Date si es necesario
    if (cabezaData.fechaNacimiento && typeof cabezaData.fechaNacimiento === 'string') {
      cabezaData.fechaNacimiento = new Date(cabezaData.fechaNacimiento);
    }
    
    // Aplicar los cambios a la cabeza de círculo existente
    Object.assign(cabeza, cabezaData);
    // Guardar los cambios en la base de datos
    return await this.cabezaCirculoRepo.save(cabeza);
  }

  // Método para eliminar una cabeza de círculo por su ID
  async remove(id: number): Promise<void> {
    // Intentar eliminar la cabeza de círculo de la base de datos
    const result = await this.cabezaCirculoRepo.delete(id);
    // Verificar si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Cabeza de Círculo con ID ${id} no encontrada`);
    }
  }

  // Método para buscar cabezas de círculo por nombre, apellidos o clave de elector
  async buscar(query: string): Promise<CabezaCirculo[]> {
    // Si no hay consulta de búsqueda, retornar todas las cabezas de círculo
    if (!query || query.trim() === '') {
      return await this.findAll();
    }
    
    // Realizar búsqueda usando Query Builder para buscar en múltiples campos
    return this.cabezaCirculoRepo
      .createQueryBuilder('cabezaCirculo')
      .where('cabezaCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('cabezaCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}