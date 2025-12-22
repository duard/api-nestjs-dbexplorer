import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InspectionService } from '../services/inspection.service';
import { QueryDto } from '../dto/inspection.dto';

@ApiTags('inspection')
@Controller('inspection')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
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
            "SELECT TOP 10 CODFUN, NOMEFUN FROM TFPFUN WHERE ATIVO = 'S'",
        },
        params: {
          type: 'array',
          items: { type: 'string' },
          description: 'Query parameters (optional)',
          example: ['S', 'ACTIVE'],
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
          'SELECT TOP 10 CODFUN, NOMEFUN FROM TFPFUN WHERE ATIVO = @param1',
        params: ['S'],
        data: [
          { CODFUN: 1, NOMEFUN: 'JOÃO SILVA' },
          { CODFUN: 2, NOMEFUN: 'MARIA SANTOS' },
          { CODFUN: 3, NOMEFUN: 'PEDRO COSTA' },
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

  @Get('table-schema/:tableName')
  @ApiOperation({ summary: 'Get table schema structure by path parameter' })
  async getTableSchemaByPath(@Param('tableName') tableName: string) {
    return this.inspectionService.getTableSchema(tableName);
  }

  @Get('table-relations/:tableName')
  @ApiOperation({
    summary: 'Get table foreign key relations by path parameter',
  })
  async getTableRelationsByPath(@Param('tableName') tableName: string) {
    return this.inspectionService.getTableRelations(tableName);
  }

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
