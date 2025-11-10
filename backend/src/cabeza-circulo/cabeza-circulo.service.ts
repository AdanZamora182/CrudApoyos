import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabezaCirculo } from './cabeza-circulo.entity';
import { lastValueFrom } from 'rxjs';
import * as ExcelJS from 'exceljs';

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

  // Método para exportar todos los registros de cabezas de círculo a Excel
  async exportToExcel(): Promise<Buffer> {
    try {
      // Obtener todos los registros
      const cabezas = await this.findAll();

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cabezas de Círculo');

      // Definir las columnas
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Apellido Paterno', key: 'apellidoPaterno', width: 20 },
        { header: 'Apellido Materno', key: 'apellidoMaterno', width: 20 },
        { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 20 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Calle', key: 'calle', width: 25 },
        { header: 'No. Exterior', key: 'noExterior', width: 12 },
        { header: 'No. Interior', key: 'noInterior', width: 12 },
        { header: 'Colonia', key: 'colonia', width: 25 },
        { header: 'Código Postal', key: 'codigoPostal', width: 15 },
        { header: 'Municipio', key: 'municipio', width: 25 },
        { header: 'Clave de Elector', key: 'claveElector', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Facebook', key: 'facebook', width: 30 },
        { header: 'Otra Red Social', key: 'otraRedSocial', width: 30 },
        { header: 'Estructura Territorial', key: 'estructuraTerritorial', width: 25 },
        { header: 'Posición en Estructura', key: 'posicionEstructura', width: 25 },
      ];

      // Estilizar el encabezado
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };

      // Agregar los datos
      cabezas.forEach((cabeza) => {
        worksheet.addRow({
          id: cabeza.id,
          nombre: cabeza.nombre,
          apellidoPaterno: cabeza.apellidoPaterno,
          apellidoMaterno: cabeza.apellidoMaterno,
          fechaNacimiento: cabeza.fechaNacimiento ? new Date(cabeza.fechaNacimiento).toLocaleDateString('es-ES') : '',
          telefono: cabeza.telefono?.toString() || '',
          calle: cabeza.calle,
          noExterior: cabeza.noExterior || '',
          noInterior: cabeza.noInterior || '',
          colonia: cabeza.colonia,
          codigoPostal: cabeza.codigoPostal,
          municipio: cabeza.municipio || '',
          claveElector: cabeza.claveElector,
          email: cabeza.email,
          facebook: cabeza.facebook || '',
          otraRedSocial: cabeza.otraRedSocial || '',
          estructuraTerritorial: cabeza.estructuraTerritorial,
          posicionEstructura: cabeza.posicionEstructura,
        });
      });

      // Aplicar bordes a todas las celdas con datos
      const rowCount = worksheet.rowCount;
      for (let i = 1; i <= rowCount; i++) {
        const row = worksheet.getRow(i);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

      // Generar el archivo Excel como buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer as ArrayBuffer);
    } catch (error) {
      console.error('Error al generar archivo Excel:', error);
      throw new Error('Error al generar el archivo Excel');
    }
  }
}