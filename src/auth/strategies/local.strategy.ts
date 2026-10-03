// Injectable permite que NestJS pueda crear esta clase e inyectarle dependencias.
import { Injectable, UnauthorizedException } from '@nestjs/common';

// PassportStrategy conecta una strategy de Passport con el sistema de NestJS.
import { PassportStrategy } from '@nestjs/passport';

// Strategy viene de passport-local y sabe leer credenciales tipo usuario/password.
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // passport-local por defecto espera username/password.
      // Aquí le decimos que nuestro campo de usuario se llama email.
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // Si retorna un usuario, Passport lo guardará temporalmente en request.user.
  // Si lanza UnauthorizedException, NestJS responde 401.
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }
}