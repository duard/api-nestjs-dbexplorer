import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from '../dto/inspection.dto';
import { InspectionService } from '../services/inspection.service';

@ApiTags('inspection')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Get('tables')
  @ApiOperation({
    summary: 'List all tables in the database',
    description: 'Returns a list of all base tables available in the database',
  })
  @ApiOkResponse({
    description: 'List of tables retrieved successfully',
    schema: {
      example: {
        tables: [
          { TABLE_NAME: 'TFPFUN', TABLE_TYPE: 'BASE TABLE' },
          { TABLE_NAME: 'TGFPAR', TABLE_TYPE: 'BASE TABLE' },
          { TABLE_NAME: 'TSIUSU', TABLE_TYPE: 'BASE TABLE' },
        ],
        totalTables: 3,
      },
    },
  })
  async listTables() {
    return this.inspectionService.listTables();
  }

  @Get('table-schema')
  @ApiOperation({
    summary: 'Get table schema structure',
    description:
      'Returns detailed column information for a specific table including data types, nullability, and constraints',
  })
  @ApiQuery({
    name: 'tableName',
    required: true,
    description: 'Name of the table to inspect',
    example: 'TFPFUN',
  })
  @ApiOkResponse({
    description: 'Table schema retrieved successfully',
    schema: {
      example: {
        tableName: 'TFPFUN',
        columns: [
          {
            COLUMN_NAME: 'CODFUN',
            DATA_TYPE: 'int',
            IS_NULLABLE: 'NO',
            COLUMN_DEFAULT: null,
            CHARACTER_MAXIMUM_LENGTH: null,
            NUMERIC_PRECISION: 10,
            NUMERIC_SCALE: 0,
            ORDINAL_POSITION: 1,
          },
          {
            COLUMN_NAME: 'NOMEFUN',
            DATA_TYPE: 'varchar',
            IS_NULLABLE: 'YES',
            COLUMN_DEFAULT: null,
            CHARACTER_MAXIMUM_LENGTH: 100,
            NUMERIC_PRECISION: null,
            NUMERIC_SCALE: null,
            ORDINAL_POSITION: 2,
          },
        ],
        totalColumns: 2,
      },
    },
  })
  async getTableSchema(@Query('tableName') tableName: string) {
    if (!tableName) {
      throw new Error('Table name is required');
    }
    return this.inspectionService.getTableSchema(tableName);
  }

  @Get('table-relations')
  @ApiOperation({
    summary: 'Get table foreign key relations',
    description:
      'Returns all foreign key relationships for a specific table, showing parent and child table connections',
  })
  @ApiQuery({
    name: 'tableName',
    required: true,
    description: 'Name of the table to inspect for relations',
    example: 'TFPFUN',
  })
  @ApiOkResponse({
    description: 'Table relations retrieved successfully',
    schema: {
      example: {
        tableName: 'TFPFUN',
        relations: [
          {
            ForeignKeyName: 'FK_TFPFUN_TGFPAR',
            ParentTable: 'TFPFUN',
            ParentColumn: 'CODPARC',
            ReferencedTable: 'TGFPAR',
            ReferencedColumn: 'CODPARC',
            DeleteAction: 'NO_ACTION',
            UpdateAction: 'NO_ACTION',
          },
        ],
        totalRelations: 1,
      },
    },
  })
  async getTableRelations(@Query('tableName') tableName: string) {
    if (!tableName) {
      throw new Error('Table name is required');
    }
    return this.inspectionService.getTableRelations(tableName);
  }

  @Post('query')
  @ApiOperation({
    summary: 'Execute SELECT query (read-only)',
    description:
      'Executes read-only SQL SELECT queries against the database. Only SELECT statements are allowed for security.',
  })
  @ApiBody({
    description: 'SQL query execution request',
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SQL SELECT query to execute',
          example:
`SELECT TOP 10\n  F.CODEMP,\n  F.CODFUNC,\n  F.NOMEFUNC,\n  F.DTNASC,\n  F.DTADM,\n  F.CPF,\n  F.CELULAR,\n  F.EMAIL,\n  F.SITUACAO,\n  U.CODUSU,\n  U.NOMEUSU,\n  U.EMAIL AS EMAILUSU,\n  U.AD_TELEFONECORP,\n  P.CODPARC,\n  P.NOMEPARC\nFROM TFPFUN F\nLEFT JOIN TSIUSU U\n  ON F.CODEMP = U.CODEMP AND F.CODFUNC = U.CODFUNC\nLEFT JOIN TGFPAR P\n  ON F.CODPARC = P.CODPARC\nORDER BY F.DTADM DESC;`,
        },
        params: {
          type: 'array',
          items: { type: 'string' },
          description: 'Query parameters (optional)',
          example: [],
        },
      },
      required: ['query'],
    },
  })
  @ApiOkResponse({
    description: 'Query executed successfully',
    schema: {
      example: {
        query:
          'SELECT TOP 10 CODFUNC, NOMEFUNC FROM TFPFUN ORDER BY CODFUNC DESC',
        params: [],
        data: [
          { CODFUNC: 1, NOMEFUNC: 'JOÃO SILVA' },
          { CODFUNC: 2, NOMEFUNC: 'MARIA SANTOS' },
          { CODFUNC: 3, NOMEFUNC: 'PEDRO COSTA' },
        ],
        rowCount: 3,
      },
    },
  })
  async executeQuery(@Body() queryDto: QueryDto) {
    if (!queryDto.query) {
      throw new Error('Query is required');
    }
    return this.inspectionService.executeQuery(queryDto.query, queryDto.params);
  }

  // ...existing code...

  @Get('primary-keys/:tableName')
  @ApiOperation({
    summary: 'Get table primary keys',
    description: 'Returns all primary key columns for a specific table',
  })
  @ApiOkResponse({
    description: 'Primary keys retrieved successfully',
    schema: {
      example: {
        tableName: 'TFPFUN',
        primaryKeys: [
          {
            TABLE_NAME: 'TFPFUN',
            COLUMN_NAME: 'CODFUN',
            ORDINAL_POSITION: 1,
            CONSTRAINT_NAME: 'PK_TFPFUN',
          },
        ],
        totalPrimaryKeys: 1,
      },
    },
  })
  async getPrimaryKeys(@Param('tableName') tableName: string) {
    return this.inspectionService.getPrimaryKeys(tableName);
  }
}
