import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SqlServerService } from 'src/database/sqlserver.service';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class TFPFUNService {
  constructor(private readonly sqlServerService: SqlServerService) {}

  async findAll(query: PaginationDto) {
    const page = query.page || 1;
    const perPage = query.perPage || 20;
    const offset = (page - 1) * perPage;
    const sqlPath = path.join(__dirname, '../sql/tfpfun-findall.sql');
    const sqlQuery = fs.readFileSync(sqlPath, 'utf8');
    const data = await this.sqlServerService.executeSQL(sqlQuery, [offset, perPage]);
    // Total count
    const totalResult = await this.sqlServerService.executeSQL('SELECT COUNT(*) as total FROM TFPFUN', []);
    const total = totalResult[0]?.total || 0;
    return { data, total, page, perPage };
  }

  async findById(codemp: number, codfunc: number) {
    const data = await this.sqlServerService.executeSQL(
      'SELECT * FROM TFPFUN WHERE CODEMP = @param1 AND CODFUNC = @param2',
      [codemp, codfunc],
    );
    return data[0] || null;
  }
}
