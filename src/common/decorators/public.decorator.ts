// SetMetadata permite guardar información interna en controllers o métodos.
// Esa información después puede ser leída por guards, interceptors u otras piezas de NestJS.
import { SetMetadata } from '@nestjs/common';

// Llave interna que usará JwtAuthGuard para buscar la metadata.
// La dejamos en constante para no escribir el string 'isPublic' en varios archivos.
export const IS_PUBLIC_KEY = 'isPublic';

// Decorador para marcar endpoints que no requieren access token.
// Ejemplo: @Public() en login, register y refresh.
// Internamente esto significa: guarda isPublic = true en este método o controller.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);