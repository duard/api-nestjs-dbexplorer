export interface PessoasFilters {
  nome?: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  ativo?: string;
  tipo?: 'cliente' | 'fornecedor' | 'funcionario' | 'transportadora' | 'vendedor';
  empresa?: string;
  departamento?: string;
  cargo?: string;
  situacao?: string;
  cliente?: string; // 'S' ou 'N'
  fornecedor?: string; // 'S' ou 'N'
  transportadora?: string; // 'S' ou 'N'
  vendedor?: string; // 'S' ou 'N'
  page?: number;
  perPage?: number;
}
