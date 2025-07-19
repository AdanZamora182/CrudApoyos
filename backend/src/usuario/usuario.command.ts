import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
@Command({
  name: 'usuario',
  description: 'Comandos para gestionar usuarios y contraseñas',
})
export class UsuarioCommand extends CommandRunner {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [accion, nombreUsuario, nuevaContraseña] = passedParams;

    switch (accion) {
      case 'cambiar-contraseña':
        await this.cambiarContraseña(nombreUsuario, nuevaContraseña);
        break;
      case 'listar':
        await this.listarUsuarios();
        break;
      case 'buscar':
        await this.buscarUsuario(nombreUsuario);
        break;
      default:
        this.mostrarAyuda();
    }
  }

  private async cambiarContraseña(nombreUsuario: string, nuevaContraseña: string) {
    if (!nombreUsuario || !nuevaContraseña) {
      console.log('❌ Error: Debes proporcionar el nombre de usuario y la nueva contraseña');
      console.log('Uso: npm run console usuario cambiar-contraseña <usuario> <nueva-contraseña>');
      return;
    }

    try {
      // Buscar el usuario
      const user = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
      if (!user) {
        console.log(`❌ Usuario "${nombreUsuario}" no encontrado`);
        return;
      }

      // Hashear la nueva contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(nuevaContraseña, saltRounds);

      // Actualizar la contraseña
      await this.usuarioRepo.update(user.id, { contraseña: hashedPassword });

      console.log(`✅ Contraseña cambiada exitosamente para el usuario: ${nombreUsuario}`);
      console.log(`📧 Email del usuario: ${user.correo}`);
    } catch (error) {
      console.log('❌ Error al cambiar contraseña:', error.message);
    }
  }

  private async listarUsuarios() {
    try {
      const usuarios = await this.usuarioRepo.find({
        select: ['id', 'nombre', 'apellidos', 'usuario', 'correo']
      });

      if (usuarios.length === 0) {
        console.log('📝 No hay usuarios registrados');
        return;
      }

      console.log('\n📋 Lista de usuarios:');
      console.log('─'.repeat(80));
      usuarios.forEach(user => {
        console.log(`ID: ${user.id} | Usuario: ${user.usuario} | Nombre: ${user.nombre} ${user.apellidos} | Email: ${user.correo}`);
      });
      console.log('─'.repeat(80));
    } catch (error) {
      console.log('❌ Error al listar usuarios:', error.message);
    }
  }

  private async buscarUsuario(nombreUsuario: string) {
    if (!nombreUsuario) {
      console.log('❌ Error: Debes proporcionar el nombre de usuario');
      console.log('Uso: npm run console usuario buscar <usuario>');
      return;
    }

    try {
      const user = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
      if (!user) {
        console.log(`❌ Usuario "${nombreUsuario}" no encontrado`);
        return;
      }

      console.log('\n👤 Información del usuario:');
      console.log('─'.repeat(40));
      console.log(`ID: ${user.id}`);
      console.log(`Nombre: ${user.nombre} ${user.apellidos}`);
      console.log(`Usuario: ${user.usuario}`);
      console.log(`Email: ${user.correo}`);
      console.log(`Código Usuario: ${user.codigoUusuario}`);
      console.log('─'.repeat(40));
    } catch (error) {
      console.log('❌ Error al buscar usuario:', error.message);
    }
  }

  private mostrarAyuda() {
    console.log('\n🔧 Comandos disponibles para gestión de usuarios:');
    console.log('─'.repeat(60));
    console.log('📝 Listar usuarios:');
    console.log('   npm run console usuario listar');
    console.log('');
    console.log('🔍 Buscar usuario:');
    console.log('   npm run console usuario buscar <nombre-usuario>');
    console.log('');
    console.log('🔑 Cambiar contraseña:');
    console.log('   npm run console usuario cambiar-contraseña <nombre-usuario> <nueva-contraseña>');
    console.log('');
    console.log('Ejemplos:');
    console.log('   npm run console usuario listar');
    console.log('   npm run console usuario buscar admin');
    console.log('   npm run console usuario cambiar-contraseña admin nuevaContraseña123');
    console.log('─'.repeat(60));
  }
}