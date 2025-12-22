import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedResult } from 'src/common/pagination/pagination.types';
import { trimFields } from 'src/common/utils/trim-fields';
import { SqlServerService } from 'src/database/sqlserver.service';
import { PESSOAS_BYID_QUERY } from '../sql/pessoas-byid';

@Injectable()
export class PessoasService {
  constructor(
    @Inject(SqlServerService)
    private readonly sqlServerService: SqlServerService,
  ) {}




  async listAll(params: {
    nome?: string;
    cpfCnpj?: string;
    email?: string;
    telefone?: string;
    ativo?: string;
    tipo?: string;
    page?: number;
    perPage?: number;
  }): Promise<any> {
    const { nome, cpfCnpj, email, telefone, ativo, tipo, page = 1, perPage = 20 } = params;
    let where: string[] = [];
    let sqlParams: any[] = [];
    if (nome) {
      where.push('par.NOMEPARC LIKE ?');
      sqlParams.push(`%${nome}%`);
    }
    if (cpfCnpj) {
      where.push('par.CGC_CPF LIKE ?');
      sqlParams.push(`%${cpfCnpj}%`);
    }
    if (email) {
      where.push('par.EMAIL LIKE ?');
      sqlParams.push(`%${email}%`);
    }
    if (telefone) {
      where.push('(par.TELEFONE LIKE ? OR par.CELULAR LIKE ?)');
      sqlParams.push(`%${telefone}%`, `%${telefone}%`);
    }
    if (ativo !== undefined) {
      where.push('par.ATIVO = ?');
      sqlParams.push(ativo);
    }
    if (tipo) {
      // tipo pode ser cliente, fornecedor, funcionario, etc
      const tipoMap: Record<string, string> = {
        cliente: 'par.CLIENTE',
        fornecedor: 'par.FORNECEDOR',
        funcionario: 'par.FUNCIONARIO',
        transportadora: 'par.TRANSPORTADORA',
        vendedor: 'par.VENDEDOR',
      };
      if (tipoMap[tipo]) {
        where.push(`${tipoMap[tipo]} = 1`);
      }
    }
    let whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    // Paginação SQL Server: OFFSET/FETCH
    const sql = `
      SELECT
        par.CODPARC,
        par.NOMEPARC,
        par.CGC_CPF,
        par.EMAIL,
        par.TELEFONE,
        par.CELULAR,
        par.ENDERECO,
        par.NUMERO,
        par.COMPLEMENTO,
        par.BAIRRO,
        par.CEP,
        par.CODMUN,
        par.UF,
        par.CODPAIS,
        par.ATIVO,
        par.CLIENTE,
        par.FORNECEDOR,
        par.TRANSPORTADORA,
        par.VENDEDOR,
        par.FUNCIONARIO,
        par.DTATUAL,
        par.OBS,
        par.CODUSU,
        par.CODFUNC
      FROM TGFPAR par
      ${whereClause}
      ORDER BY par.CODPARC
      OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    `;
    // Para total
    const countSql = `SELECT COUNT(*) as total FROM TGFPAR par ${whereClause}`;
    const totalRows = await this.sqlServerService.executeSQL(countSql, sqlParams);
    const total = totalRows[0]?.total || 0;
    // Paginação params
    const offset = (page - 1) * perPage;
    const paginatedParams = [...sqlParams, offset, perPage];
    const result = await this.sqlServerService.executeSQL(sql, paginatedParams);
    return buildPaginatedResult({
      data: result.map(trimFields),
      total,
      page,
      perPage,
    });
  }

  async getById(id: number): Promise<any | null> {
    const result = await this.sqlServerService.executeSQL(PESSOAS_BYID_QUERY, [id]);
    if (result.length > 0) {
      return trimFields(result[0]);
    }
    return null;
  }
}
