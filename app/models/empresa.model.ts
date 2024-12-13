export interface Empresa {
  id: number;
  phone: string;
  email: string;
  fullName: string;
  description: string | null;
  alias: string;
  category: string;
  location: string;
  active: boolean;
  features: string;
  responsiblePerson: string;
  responsibleEmail: string;
}
