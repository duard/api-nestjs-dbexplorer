import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult, buildPaginatedResult } from 'src/common/pagination/pagination.types';
import { trimFields } from 'src/common/utils/trim-fields';
import { SqlServerService } from 'src/database/sqlserver.service';
import { queryPortoesAcessos } from '../../../../sql/query-portoes-acessos';
import { queryPortoesAcessosByPortaoId } from '../../../../sql/query-portoes-acessos-by-portao-id';
import { queryPortoesUltimosAcessos } from '../../../../sql/query-portoes-ultimos-acessos';

@Injectable()
export class PortoesService {
  constructor(
    @Inject(SqlServerService)
    private readonly sqlServerService: SqlServerService,
  ) {}

  async getPortoesAcessos(ipPortao?: string, usuario?: string, page = 1, perPage = 20): Promise<PaginatedResult<any>> {
    const paramValue = ipPortao ?? '';
    const offset = (page - 1) * perPage;
    const query = queryPortoesAcessos.replace(/\$P\{P_IP_PORTAO\}/g, `@param1`);
    const startTime = Date.now();
    let allResults = await this.sqlServerService.executeSQL(query, [paramValue, offset, perPage]);
    const sqlTime = Date.now() - startTime;
    console.log(`[PERF] getPortoesAcessos SQL: ${sqlTime}ms, total rows: ${allResults.length}`);
    if (usuario) {
      const usuarioLower = usuario.trim().toLowerCase();
      allResults = allResults.filter((row: any) =>
        (row.Nome && row.Nome.toLowerCase().includes(usuarioLower)) ||
        (row.NOME_FUNCIONARIO && row.NOME_FUNCIONARIO.toLowerCase().includes(usuarioLower))
      );
    }
    // Não é possível saber o total real sem uma segunda query COUNT, então retornamos o length da página
    const total = allResults.length;
    const data = allResults.map(trimFields);
    return buildPaginatedResult({ data, total, page, perPage });
  }

  async getUltimosAcessos(usuario?: string, page = 1, perPage = 20): Promise<PaginatedResult<any>> {
    const offset = (page - 1) * perPage;
    const startTime = Date.now();
    let allResults = await this.sqlServerService.executeSQL(queryPortoesUltimosAcessos, [offset, perPage]);
    const sqlTime = Date.now() - startTime;
    console.log(`[PERF] getUltimosAcessos SQL: ${sqlTime}ms, total rows: ${allResults.length}`);
    if (usuario) {
      const usuarioLower = usuario.trim().toLowerCase();
      allResults = allResults.filter((row: any) =>
        (row.Nome && row.Nome.toLowerCase().includes(usuarioLower)) ||
        (row.NOME_FUNCIONARIO && row.NOME_FUNCIONARIO.toLowerCase().includes(usuarioLower))
      );
    }
    const total = allResults.length;
    const data = allResults.map(trimFields);
    return buildPaginatedResult({ data, total, page, perPage });
  }

  async getAcessosByPortaoId(portaoId: string, usuario?: string, page = 1, perPage = 20): Promise<PaginatedResult<any>> {
    const offset = (page - 1) * perPage;
    const startTime = Date.now();
    let allResults = await this.sqlServerService.executeSQL(queryPortoesAcessosByPortaoId, [portaoId, offset, perPage]);
    const sqlTime = Date.now() - startTime;
    console.log(`[PERF] getAcessosByPortaoId SQL: ${sqlTime}ms, total rows: ${allResults.length}`);
    if (usuario) {
      const usuarioLower = usuario.trim().toLowerCase();
      allResults = allResults.filter((row: any) =>
        (row.Nome && row.Nome.toLowerCase().includes(usuarioLower)) ||
        (row.NOME_FUNCIONARIO && row.NOME_FUNCIONARIO.toLowerCase().includes(usuarioLower))
      );
    }
    const total = allResults.length;
    const data = allResults.map(trimFields);
    return buildPaginatedResult({ data, total, page, perPage });
  }


}
