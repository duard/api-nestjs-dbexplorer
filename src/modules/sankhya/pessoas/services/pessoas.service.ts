import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedResult } from 'src/common/pagination/pagination.types';
import { trimFields } from 'src/common/utils/trim-fields';
import { SqlServerService } from 'src/database/sqlserver.service';
import { buildWhere } from '../pessoas.filters';
import { BASE_FROM, PESSOAS_SELECT } from '../pessoas.sql';
import { PessoasFilters } from '../pessoas.types';
import { PESSOAS_BYID_QUERY } from '../sql/pessoas-byid';

@Injectable()
export class PessoasService {
  constructor(
    @Inject(SqlServerService)
    private readonly sqlServerService: SqlServerService,
  ) {}




  async listAll(filters: PessoasFilters) {
    const page = filters.page ?? 1;
    const perPage = filters.perPage ?? 20;

    const { whereClause, params } = buildWhere(filters);
    const offset = (page - 1) * perPage;

    const sql = `
      ${PESSOAS_SELECT}
      ${BASE_FROM}
      ${whereClause}
      ORDER BY f.CODFUNC
      OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      ${BASE_FROM}
      ${whereClause}
    `;

    // MSSQL não aceita '?' como placeholder, precisa ser @paramN
    // Adaptar params para countSql e sql
    // Substituir todos os '?' por @paramN
    function replacePlaceholders(query: string, params: any[]) {
      let idx = 0;
      return query.replace(/\?/g, () => `@param${++idx}`);
    }
    const countSqlFixed = replacePlaceholders(countSql, params);
    const sqlFixed = replacePlaceholders(sql, [...params, offset, perPage]);
    const totalResult = await this.sqlServerService.executeSQL(countSqlFixed, params);
    const total = totalResult[0]?.total ?? 0;
    const data = await this.sqlServerService.executeSQL(
      sqlFixed,
      [...params, offset, perPage],
    );
    return buildPaginatedResult({
      data: data.map(trimFields),
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
