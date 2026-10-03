// Forma mínima del usuario autenticado que guardaremos en request.user.
// No incluimos passwordHash ni datos sensibles.
export type AuthenticatedUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPERVISOR';
};