import { ExecutionContext, Injectable } from '@nestjs/common';

// Reflector permite leer metadata creada con SetMetadata.
// En este tutorial lo usamos para detectar si una ruta tiene @Public().
import { Reflector } from '@nestjs/core';

// AuthGuard('jwt') sabe ejecutar JwtStrategy.
import { AuthGuard } from '@nestjs/passport';

// Importamos la misma llave que usó @Public().
// Así el guard sabe exactamente qué metadata debe buscar.
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Reflector es inyectado por NestJS.
  // Lo necesitamos para leer metadata del método o controller actual.
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // Este guard se ejecuta antes de los endpoints protegidos.
  canActivate(context: ExecutionContext) {
    // context.getHandler() representa el método del controller.
    // Ejemplo: login(), register(), findAll().
    //
    // context.getClass() representa la clase controller completa.
    // Ejemplo: AuthController o UsersController.
    //
    // getAllAndOverride busca metadata primero en el método y luego en la clase.
    // Si encuentra @Public(), isPublic será true.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // Si la ruta tiene @Public(), no pedimos JWT.
      // Esto permite entrar a login/register/refresh sin token.
      return true;
    }

    // Si no es público, delegamos la validación a passport-jwt.
    // Passport ejecutará JwtStrategy, revisará el Bearer token y llenará request.user.
    return super.canActivate(context);
  }
}