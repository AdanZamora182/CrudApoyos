import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegranteCirculo } from './integrante-circulo.entity';
import * as ExcelJS from 'exceljs';

// Servicio que contiene la lógica de negocio para la gestión de integrantes de círculo
@Injectable()
export class IntegranteCirculoService {
  // Inyección del repositorio de integrante de círculo para operaciones con la base de datos
  constructor(
    @InjectRepository(IntegranteCirculo)
    private readonly integranteCirculoRepo: Repository<IntegranteCirculo>,
  ) {}

  // Método para crear y guardar un nuevo integrante de círculo en la base de datos
  async create(integranteCirculoData: IntegranteCirculo): Promise<IntegranteCirculo> {
    try {
      // Crear una nueva instancia de integrante de círculo con los datos recibidos
      const nuevoIntegrante = this.integranteCirculoRepo.create(integranteCirculoData);
      // Guardar el integrante en la base de datos y retornarlo
      return await this.integranteCirculoRepo.save(nuevoIntegrante);
    } catch (error) {
      console.error('Error en el servicio al crear Integrante de Círculo:', error);
      throw error;
    }
  }

  // Método para obtener todos los integrantes de círculo con sus relaciones
  async findAll(): Promise<IntegranteCirculo[]> {
    // Incluir la relación con el líder (CabezaCirculo)
    return await this.integranteCirculoRepo.find({ relations: ['lider'] });
  }

  // Método para buscar un integrante específico por su ID
  async findOne(id: number): Promise<IntegranteCirculo> {
    // Buscar el integrante incluyendo la relación con el líder
    const integrante = await this.integranteCirculoRepo.findOne({ where: { id }, relations: ['lider'] });
    // Lanzar excepción si no se encuentra el integrante
    if (!integrante) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
    return integrante;
  }

  // Método para actualizar un integrante existente
  async update(id: number, integranteData: Partial<IntegranteCirculo>): Promise<IntegranteCirculo> {
    // Buscar el integrante existente (lanza excepción si no existe)
    const integrante = await this.findOne(id);
    
    // Convertir fecha de string a objeto Date si es necesario
    if (integranteData.fechaNacimiento && typeof integranteData.fechaNacimiento === 'string') {
      integranteData.fechaNacimiento = new Date(integranteData.fechaNacimiento);
    }
    
    // Aplicar los cambios al integrante existente
    Object.assign(integrante, integranteData);
    // Guardar los cambios en la base de datos
    return await this.integranteCirculoRepo.save(integrante);
  }

  // Método para eliminar un integrante por su ID
  async remove(id: number): Promise<void> {
    // Intentar eliminar el integrante de la base de datos
    const result = await this.integranteCirculoRepo.delete(id);
    // Verificar si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Integrante de Círculo con ID ${id} no encontrado`);
    }
  }

  // Método para buscar integrantes por nombre, apellidos o clave de elector
  async buscar(query: string): Promise<IntegranteCirculo[]> {
    // Si no hay consulta de búsqueda, retornar todos los registros con datos completos
    if (!query || query.trim() === '') {
      return await this.findAll();
    }

    // Realizar búsqueda usando Query Builder incluyendo la relación con el líder
    return this.integranteCirculoRepo
      .createQueryBuilder('integranteCirculo')
      .leftJoinAndSelect('integranteCirculo.lider', 'lider') // Incluir relación con el líder
      .where('integranteCirculo.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoPaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.apellidoMaterno LIKE :query', { query: `%${query}%` })
      .orWhere('integranteCirculo.claveElector LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  // Método para exportar todos los registros de integrantes de círculo a Excel
  async exportToExcel(): Promise<Buffer> {
    // Obtener todos los registros con sus relaciones
    const integrantes = await this.findAll();

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Integrantes de Círculo');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Apellido Paterno', key: 'apellidoPaterno', width: 20 },
      { header: 'Apellido Materno', key: 'apellidoMaterno', width: 20 },
      { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 20 },
      { header: 'Calle', key: 'calle', width: 25 },
      { header: 'No. Exterior', key: 'noExterior', width: 12 },
      { header: 'No. Interior', key: 'noInterior', width: 12 },
      { header: 'Colonia', key: 'colonia', width: 25 },
      { header: 'Código Postal', key: 'codigoPostal', width: 15 },
      { header: 'Municipio', key: 'municipio', width: 25 },
      { header: 'Clave de Elector', key: 'claveElector', width: 20 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Líder (ID)', key: 'liderId', width: 12 },
      { header: 'Líder (Nombre Completo)', key: 'liderNombre', width: 40 },
    ];

    // Estilizar el encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Agregar los datos
    integrantes.forEach((integrante) => {
      const liderNombre = integrante.lider
        ? `${integrante.lider.nombre} ${integrante.lider.apellidoPaterno} ${integrante.lider.apellidoMaterno}`
        : '';

      worksheet.addRow({
        id: integrante.id,
        nombre: integrante.nombre,
        apellidoPaterno: integrante.apellidoPaterno,
        apellidoMaterno: integrante.apellidoMaterno,
        fechaNacimiento: integrante.fechaNacimiento,
        calle: integrante.calle,
        noExterior: integrante.noExterior || '',
        noInterior: integrante.noInterior || '',
        colonia: integrante.colonia,
        codigoPostal: integrante.codigoPostal || '',
        municipio: integrante.municipio || '',
        claveElector: integrante.claveElector,
        telefono: integrante.telefono?.toString(),
        liderId: integrante.lider?.id || '',
        liderNombre: liderNombre,
      });
    });

    // Generar el archivo Excel como buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}