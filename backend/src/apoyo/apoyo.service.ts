import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apoyo } from './apoyo.entity';
import * as ExcelJS from 'exceljs';

// Servicio que contiene la lógica de negocio para la gestión de apoyos
@Injectable()
export class ApoyoService {
  // Inyección del repositorio de apoyo para operaciones con la base de datos
  constructor(
    @InjectRepository(Apoyo)
    private readonly apoyoRepo: Repository<Apoyo>,
  ) {}

  // Método para crear y guardar un nuevo apoyo en la base de datos
  async create(apoyoData: Apoyo): Promise<Apoyo> {
    try {
      // Crear una nueva instancia de apoyo con los datos recibidos
      const nuevoApoyo = this.apoyoRepo.create(apoyoData);
      // Guardar el apoyo en la base de datos y retornarlo
      return await this.apoyoRepo.save(nuevoApoyo);
    } catch (error) {
      console.error('Error en el servicio al crear Apoyo:', error);
      throw error;
    }
  }

  // Método para obtener todos los apoyos con sus relaciones
  async findAll(): Promise<Apoyo[]> {
    return await this.apoyoRepo.find({ 
      // Incluir las relaciones con persona (IntegranteCirculo) y cabeza (CabezaCirculo)
      relations: ['persona', 'cabeza'],
      // Ordenar por ID de forma descendente (más recientes primero)
      order: { id: 'DESC' }
    });
  }
  
  // Método para buscar un apoyo específico por su ID
  async findOne(id: number): Promise<Apoyo> {
    const apoyo = await this.apoyoRepo.findOne({ 
      where: { id },
      // Incluir las relaciones con persona y cabeza
      relations: ['persona', 'cabeza']
    });
    
    // Lanzar excepción si no se encuentra el apoyo
    if (!apoyo) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
    
    return apoyo;
  }
  
  // Método para actualizar un apoyo existente
  async update(id: number, apoyoData: Partial<Apoyo>): Promise<Apoyo> {
    // Buscar el apoyo existente (lanza excepción si no existe)
    const apoyo = await this.findOne(id);
    
    // Convertir fecha de string a objeto Date si es necesario
    if (apoyoData.fechaEntrega && typeof apoyoData.fechaEntrega === 'string') {
      apoyoData.fechaEntrega = new Date(apoyoData.fechaEntrega);
    }
    
    // Aplicar los cambios al apoyo existente
    Object.assign(apoyo, apoyoData);
    // Guardar los cambios en la base de datos
    return await this.apoyoRepo.save(apoyo);
  }
  
  // Método para eliminar un apoyo por su ID
  async remove(id: number): Promise<void> {
    // Intentar eliminar el apoyo de la base de datos
    const result = await this.apoyoRepo.delete(id);
    // Verificar si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Apoyo con ID ${id} no encontrado`);
    }
  }

  // Método para exportar todos los registros de apoyos a Excel con información del beneficiario
  async exportToExcel(): Promise<Buffer> {
    // Obtener todos los registros con sus relaciones
    const apoyos = await this.findAll();

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Apoyos');

    // Definir las columnas (incluye información del apoyo y del beneficiario)
    worksheet.columns = [
      { header: 'ID Apoyo', key: 'id', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Tipo de Apoyo', key: 'tipoApoyo', width: 30 },
      { header: 'Fecha de Entrega', key: 'fechaEntrega', width: 20 },
      { header: 'Tipo de Beneficiario', key: 'tipoBeneficiario', width: 20 },
      { header: 'ID Beneficiario', key: 'beneficiarioId', width: 15 },
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
    apoyos.forEach((apoyo) => {
      let beneficiario: any;
      let tipoBeneficiario: string;
      let beneficiarioId: number | string;

      // Determinar si el beneficiario es una cabeza de círculo o un integrante
      if (apoyo.cabeza) {
        beneficiario = apoyo.cabeza;
        tipoBeneficiario = 'Cabeza de Círculo';
        beneficiarioId = apoyo.cabeza.id;
      } else if (apoyo.persona) {
        beneficiario = apoyo.persona;
        tipoBeneficiario = 'Integrante de Círculo';
        beneficiarioId = apoyo.persona.id;
      } else {
        beneficiario = null;
        tipoBeneficiario = 'Sin beneficiario';
        beneficiarioId = '';
      }

      worksheet.addRow({
        id: apoyo.id,
        cantidad: apoyo.cantidad,
        tipoApoyo: apoyo.tipoApoyo,
        fechaEntrega: apoyo.fechaEntrega,
        tipoBeneficiario: tipoBeneficiario,
        beneficiarioId: beneficiarioId,
        nombre: beneficiario?.nombre || '',
        apellidoPaterno: beneficiario?.apellidoPaterno || '',
        apellidoMaterno: beneficiario?.apellidoMaterno || '',
        fechaNacimiento: beneficiario?.fechaNacimiento || '',
        telefono: beneficiario?.telefono?.toString() || '',
        calle: beneficiario?.calle || '',
        noExterior: beneficiario?.noExterior || '',
        noInterior: beneficiario?.noInterior || '',
        colonia: beneficiario?.colonia || '',
        codigoPostal: beneficiario?.codigoPostal || '',
        municipio: beneficiario?.municipio || '',
        claveElector: beneficiario?.claveElector || '',
        email: beneficiario?.email || '',
      });
    });

    // Generar el archivo Excel como buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}