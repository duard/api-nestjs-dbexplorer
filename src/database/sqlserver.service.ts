
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class SqlServerService {
  private pool: sql.ConnectionPool | null = null;

  constructor(private configService: ConfigService) {}

  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool && this.pool.connected) {
      return this.pool;
    }
    this.pool = new sql.ConnectionPool({
      user: this.configService.get<string>('SQLSERVER_USER'),
      password: this.configService.get<string>('SQLSERVER_PASSWORD'),
      server: this.configService.get<string>('SQLSERVER_SERVER')!,
      database: this.configService.get<string>('SQLSERVER_DATABASE'),
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });
    await this.pool.connect();
    return this.pool;
  }

  async executeSQL(query: string, params: any[]): Promise<any> {
    try {
      console.log('[SQL RAW]', query);
      console.log('[SQL PARAMS]', params);
      const pool = await this.getPool();
      const request = pool.request();
      params.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('[SQL ERROR]', error);
      // Retornar o erro completo na resposta para debug
      throw new InternalServerErrorException({
        message: 'Erro ao executar consulta SQL',
        sql: query,
        params,
        error: error?.message || error,
        stack: error?.stack,
      });
    }
  }
}
