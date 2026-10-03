// createParamDecorator permite crear un decorador para parámetros de métodos.
// Ejemplo de uso: me(@CurrentUser() user: AuthenticatedUser)
// ExecutionContext permite acceder al contexto de ejecución de NestJS.
// En una API HTTP, desde ese contexto podemos llegar al request.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../types/authenticated-user.type';

// Decorador para leer request.user sin repetir código en cada controller.
// request.user lo llena Passport después de validar el JWT.
export const CurrentUser = createParamDecorator(
  // _data queda disponible si algún día usamos @CurrentUser('email').
  // En este tutorial no lo usamos, por eso lo dejamos como unknown.
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    // Cambiamos del contexto general de NestJS al contexto HTTP.
    // Desde ahí obtenemos el request real de Express.
    const request = context.switchToHttp().getRequest();

    // Passport guarda aquí el usuario autenticado.
    // Ese usuario viene desde JwtStrategy.validate().
    return request.user;
  },
);