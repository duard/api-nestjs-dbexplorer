import { PessoasFilters } from './pessoas.types';

export function buildWhere(filters: PessoasFilters) {
  const where: string[] = [];
  const params: any[] = [];

  if (filters.nome) {
    where.push('f.NOMEFUNC LIKE ?');
    params.push(`%${filters.nome}%`);
  }
  if (filters.cpfCnpj) {
    where.push('f.CPF LIKE ?');
    params.push(`%${filters.cpfCnpj}%`);
  }
  if (filters.email) {
    where.push('f.EMAIL LIKE ?');
    params.push(`%${filters.email}%`);
  }
  if (filters.telefone) {
    where.push('(f.CELULAR LIKE ? OR f.TELEFONE LIKE ?)');
    params.push(`%${filters.telefone}%`, `%${filters.telefone}%`);
  }
  if (filters.ativo !== undefined) {
    where.push('f.ATIVO = ?');
    params.push(filters.ativo);
  }
  const tipoMap: Record<string, string> = {
    cliente: 'f.CLIENTE',
    fornecedor: 'f.FORNECEDOR',
    funcionario: 'f.FUNCIONARIO',
    transportadora: 'f.TRANSPORTADORA',
    vendedor: 'f.VENDEDOR',
  };
  if (filters.tipo && tipoMap[filters.tipo]) {
    where.push(`${tipoMap[filters.tipo]} = 1`);
  }
  if (filters.empresa) {
    where.push('e.NOMEFANTASIA LIKE ?');
    params.push(`%${filters.empresa}%`);
  }
  if (filters.departamento) {
    where.push('d.DESCRDEP LIKE ?');
    params.push(`%${filters.departamento}%`);
  }
  if (filters.cargo) {
    where.push('cg.DESCRCARGO LIKE ?');
    params.push(`%${filters.cargo}%`);
  }
  if (filters.situacao) {
    where.push('f.SITUACAO = ?');
    params.push(filters.situacao);
  }
  if (filters.cliente) {
    where.push('par.CLIENTE = ?');
    params.push(filters.cliente);
  }
  if (filters.fornecedor) {
    where.push('par.FORNECEDOR = ?');
    params.push(filters.fornecedor);
  }
  if (filters.transportadora) {
    where.push('par.TRANSPORTADORA = ?');
    params.push(filters.transportadora);
  }
  if (filters.vendedor) {
    where.push('par.VENDEDOR = ?');
    params.push(filters.vendedor);
  }
  return {
    whereClause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
  };
}
