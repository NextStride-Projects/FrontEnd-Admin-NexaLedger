export interface Log {
  id: number;
  action: string;
  userId: string;
  empresaId: number;
  accessedEmpresaId: number | null;
  accessedUsuarioId: number | null;
  timestamp: string;
}
