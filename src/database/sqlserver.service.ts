
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class SqlServerService {
  private pool: sql.ConnectionPool;

  constructor(private configService: ConfigService) {
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
  }

  async executeSQL(query: string, params: any[]): Promise<any> {
    try {
      await this.pool.connect();
      const request = this.pool.request();
      params.forEach((value, index) => {
        request.input(`param${index + 1}`, value);
      });
      const result = await request.query(query);
      return result.recordset;
    } finally {
      await this.pool.close();
    }
  }
}
