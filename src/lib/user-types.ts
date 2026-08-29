/** Perfil devuelto por `GET /api/v1/users/me` (OpenAPI `User`). */
export type CurrentUser = {
  id: number;
  email: string;
  created_at: string;
};
