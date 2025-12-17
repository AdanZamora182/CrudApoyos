import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { AdminPanelService } from './admin-panel.service';
import * as bcrypt from 'bcrypt';

// Comando de consola para gestionar usuarios y contraseñas desde la línea de comandos
@Injectable()
@Command({
  name: 'usuario',
  description: 'Comandos para gestionar usuarios y contraseñas',
})
export class UsuarioCommand extends CommandRunner {
  // Inyección del repositorio de usuario para operaciones directas con la base de datos
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private readonly adminPanelService: AdminPanelService,
  ) {
    super();
  }

  // Método principal que ejecuta diferentes acciones según los parámetros recibidos
  async run(passedParams: string[]): Promise<void> {
    const [accion, nombreUsuario, nuevaContraseña] = passedParams;

    // Determinar qué acción ejecutar según el primer parámetro
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
      case 'generar-token-admin':
        await this.generarTokenAdmin();
        break;
      case 'generar-token-local':
        this.generarTokenLocal();
        break;
      default:
        this.mostrarAyuda();
    }
  }

  // Método para cambiar la contraseña de un usuario específico
  private async cambiarContraseña(nombreUsuario: string, nuevaContraseña: string) {
    // Validar que se proporcionen ambos parámetros
    if (!nombreUsuario || !nuevaContraseña) {
      console.log('❌ Error: Debes proporcionar el nombre de usuario y la nueva contraseña');
      console.log('Uso: npm run console usuario cambiar-contraseña <usuario> <nueva-contraseña>');
      return;
    }

    try {
      // Buscar el usuario en la base de datos
      const user = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
      if (!user) {
        console.log(`❌ Usuario "${nombreUsuario}" no encontrado`);
        return;
      }

      // Hashear la nueva contraseña usando bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(nuevaContraseña, saltRounds);

      // Actualizar la contraseña en la base de datos
      await this.usuarioRepo.update(user.id, { contraseña: hashedPassword });

      console.log(`✅ Contraseña cambiada exitosamente para el usuario: ${nombreUsuario}`);
      console.log(`📧 Email del usuario: ${user.correo}`);
    } catch (error) {
      console.log('❌ Error al cambiar contraseña:', error.message);
    }
  }

  // Método para listar todos los usuarios registrados en el sistema
  private async listarUsuarios() {
    try {
      // Obtener todos los usuarios sin incluir las contraseñas por seguridad
      const usuarios = await this.usuarioRepo.find({
        select: ['id', 'nombre', 'apellidos', 'usuario', 'correo']
      });

      if (usuarios.length === 0) {
        console.log('📝 No hay usuarios registrados');
        return;
      }

      // Mostrar la lista de usuarios en formato tabular
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

  // Método para buscar y mostrar información de un usuario específico
  private async buscarUsuario(nombreUsuario: string) {
    // Validar que se proporcione el nombre de usuario
    if (!nombreUsuario) {
      console.log('❌ Error: Debes proporcionar el nombre de usuario');
      console.log('Uso: npm run console usuario buscar <usuario>');
      return;
    }

    try {
      // Buscar el usuario por nombre de usuario
      const user = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
      if (!user) {
        console.log(`❌ Usuario "${nombreUsuario}" no encontrado`);
        return;
      }

      // Mostrar información detallada del usuario (sin contraseña)
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

  // Método para mostrar la ayuda con todos los comandos disponibles
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
    console.log('🔐 Generar token de admin (desarrollo/pruebas):');
    console.log('   npm run console usuario generar-token-admin');
    console.log('');
    console.log('🔑 Generar token LOCAL (sin enviar correo - desarrollo):');
    console.log('   npm run console usuario generar-token-local');
    console.log('');
    console.log('Ejemplos:');
    console.log('   npm run console usuario listar');
    console.log('   npm run console usuario buscar admin');
    console.log('   npm run console usuario cambiar-contraseña admin nuevaContraseña123');
    console.log('   npm run console usuario generar-token-local');
    console.log('─'.repeat(60));
  }

  // Método para generar el token de admin y enviarlo por correo (para desarrollo/pruebas)
  private async generarTokenAdmin() {
    console.log('\n🔐 Generando token de administración...');
    console.log('─'.repeat(60));

    try {
      const authFile = await this.adminPanelService.generateAndSendNewToken();
      
      console.log('✅ Token generado exitosamente!');
      console.log('');
      console.log('📋 Detalles del token:');
      console.log(`   📅 Creado: ${new Date(authFile.createdAt).toLocaleString('es-MX')}`);
      console.log(`   ⏰ Expira: ${new Date(authFile.expiresAt).toLocaleString('es-MX')}`);
      console.log(`   🔢 Versión: ${authFile.version}`);
      console.log('');
      console.log('📧 El archivo admin-auth.json ha sido enviado al correo del administrador.');
      console.log('');
      console.log('💡 Para pruebas locales, también puedes usar el token directamente:');
      console.log('─'.repeat(60));
      console.log(authFile.token);
      console.log('─'.repeat(60));
      console.log('');
      console.log('📁 O guarda este JSON como admin-auth.json:');
      console.log(JSON.stringify(authFile, null, 2));
    } catch (error) {
      console.log('❌ Error al generar token:', error.message);
      console.log('');
      console.log('💡 Verifica que las variables de entorno SMTP estén configuradas:');
      console.log('   - SMTP_HOST');
      console.log('   - SMTP_PORT');
      console.log('   - SMTP_USER');
      console.log('   - SMTP_PASS');
      console.log('   - ADMIN_EMAIL');
      console.log('   - ADMIN_PANEL_SECRET');
    }
  }

  // Método para generar el token localmente SIN enviar correo (ideal para desarrollo)
  private generarTokenLocal() {
    console.log('\n🔑 Generando token de administración (modo local)...');
    console.log('─'.repeat(60));

    try {
      // Generar token sin enviar correo
      const authFile = this.adminPanelService.generateAdminToken();
      
      console.log('✅ Token generado exitosamente (sin enviar correo)!');
      console.log('');
      console.log('📋 Detalles del token:');
      console.log(`   📅 Creado: ${new Date(authFile.createdAt).toLocaleString('es-MX')}`);
      console.log(`   ⏰ Expira: ${new Date(authFile.expiresAt).toLocaleString('es-MX')}`);
      console.log(`   🔢 Versión: ${authFile.version}`);
      console.log('');
      console.log('🔐 TOKEN (usa esto en el header Authorization: AdminToken <token>):');
      console.log('─'.repeat(60));
      console.log(authFile.token);
      console.log('─'.repeat(60));
      console.log('');
      console.log('📁 Guarda este JSON como admin-auth.json para el panel de admin:');
      console.log(JSON.stringify(authFile, null, 2));
      console.log('');
      console.log('💡 Tip: Copia el JSON anterior y guárdalo en un archivo admin-auth.json');
    } catch (error) {
      console.log('❌ Error al generar token:', error.message);
    }
  }
}