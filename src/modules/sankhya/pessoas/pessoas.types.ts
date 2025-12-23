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
  page?: number;
  perPage?: number;
}
