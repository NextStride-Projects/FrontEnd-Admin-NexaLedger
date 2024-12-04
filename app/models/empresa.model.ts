export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  fullName: string;
  description: string | null;
  alias: string;
  category: string;
  location: string;
  active: boolean;
  features: string | null;
  responsiblePerson: string;
  responsibleEmail: string;
  staffCount: number;
}
