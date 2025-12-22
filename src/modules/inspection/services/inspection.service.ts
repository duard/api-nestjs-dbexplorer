import { Injectable } from '@nestjs/common';
import { SqlServerService } from '../../../database/sqlserver.service';

@Injectable()
export class InspectionService {
  constructor(private readonly sqlServerService: SqlServerService) {}

  async getTableSchema(tableName: string): Promise<any> {
    try {
      const query = `
        SELECT 
            COLUMN_NAME,
            DATA_TYPE,
            IS_NULLABLE,
            COLUMN_DEFAULT,
            CHARACTER_MAXIMUM_LENGTH,
            NUMERIC_PRECISION,
            NUMERIC_SCALE,
            ORDINAL_POSITION
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = @param1
        ORDER BY ORDINAL_POSITION
      `;

      const params = [tableName];
      const result = await this.sqlServerService.executeSQL(query, params);

      return {
        tableName,
        columns: result || [],
        totalColumns: result?.length || 0,
      };
    } catch (error) {
      throw new Error(
        `Failed to get table schema for ${tableName}: ${error.message}`,
      );
    }
  }

  async getTableRelations(tableName: string): Promise<any> {
    try {
      const query = `
        SELECT 
            fk.name AS ForeignKeyName,
            tp.name AS ParentTable,
            cp.name AS ParentColumn,
            tr.name AS ReferencedTable,
            cr.name AS ReferencedColumn,
            fk.delete_referential_action_desc AS DeleteAction,
            fk.update_referential_action_desc AS UpdateAction
        FROM 
            sys.foreign_keys AS fk
        INNER JOIN 
            sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
        INNER JOIN 
            sys.tables AS tp ON fkc.parent_object_id = tp.object_id
        INNER JOIN 
            sys.columns AS cp ON fkc.parent_object_id = cp.object_id 
                                AND fkc.parent_column_id = cp.column_id
        INNER JOIN 
            sys.tables AS tr ON fkc.referenced_object_id = tr.object_id
        INNER JOIN 
            sys.columns AS cr ON fkc.referenced_object_id = cr.object_id 
                                AND fkc.referenced_column_id = cr.column_id
        WHERE 
            tp.name = @param1 OR tr.name = @param1
        ORDER BY 
            tp.name, tr.name, cp.name, cr.name
      `;

      const params = [tableName];
      const result = await this.sqlServerService.executeSQL(query, params);

      return {
        tableName,
        relations: result || [],
        totalRelations: result?.length || 0,
      };
    } catch (error) {
      throw new Error(
        `Failed to get table relations for ${tableName}: ${error.message}`,
      );
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      // Basic validation to prevent dangerous queries
      const dangerousKeywords = [
        'DROP',
        'DELETE',
        'UPDATE',
        'INSERT',
        'ALTER',
        'CREATE',
        'TRUNCATE',
      ];
      const upperQuery = query.toUpperCase();

      for (const keyword of dangerousKeywords) {
        if (upperQuery.includes(keyword)) {
          throw new Error(
            `Dangerous keyword '${keyword}' not allowed in queries`,
          );
        }
      }

      // Only allow SELECT queries
      if (!upperQuery.trim().startsWith('SELECT')) {
        throw new Error('Only SELECT queries are allowed');
      }

      const result = await this.sqlServerService.executeSQL(query, params);

      return {
        query,
        params: params || [],
        data: result || [],
        rowCount: result?.length || 0,
      };
    } catch (error) {
      throw new Error(`Failed to execute query: ${error.message}`);
    }
  }

  async listTables(): Promise<any> {
    try {
      const query = `
        SELECT 
            TABLE_NAME,
            TABLE_TYPE
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
      `;

      const result = await this.sqlServerService.executeSQL(query, []);

      return {
        tables: result || [],
        totalTables: result?.length || 0,
      };
    } catch (error) {
      throw new Error(`Failed to list tables: ${error.message}`);
    }
  }

  async getPrimaryKeys(tableName: string): Promise<any> {
    try {
      const query = `
        SELECT 
            kcu.TABLE_NAME,
            kcu.COLUMN_NAME,
            kcu.ORDINAL_POSITION,
            tc.CONSTRAINT_NAME
        FROM 
            INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        INNER JOIN 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
            ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME 
            AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
        WHERE 
            tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
            AND tc.TABLE_NAME = @param1
        ORDER BY 
            kcu.ORDINAL_POSITION
      `;

      const params = [tableName];
      const result = await this.sqlServerService.executeSQL(query, params);

      return {
        tableName,
        primaryKeys: result || [],
        totalPrimaryKeys: result?.length || 0,
      };
    } catch (error) {
      throw new Error(
        `Failed to get primary keys for ${tableName}: ${error.message}`,
      );
    }
  }
}
