// Injectable registra este guard como una clase manejada por NestJS.
import { Injectable } from '@nestjs/common';

// AuthGuard viene de @nestjs/passport.
// Al pasarle 'local', NestJS ejecuta LocalStrategy.
import { AuthGuard } from '@nestjs/passport';

// Usa la estrategia local.strategy.ts para validar email y password.
// No escribimos lógica aquí porque AuthGuard('local') ya sabe llamar a LocalStrategy.validate().
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}