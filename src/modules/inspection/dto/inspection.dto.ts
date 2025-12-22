export class TableSchemaDto {
  tableName: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty({
    description: 'SQL SELECT query to execute',
    example: 'SELECT TOP 10 CODFUN, NOMEFUN FROM TFPFUN WHERE ATIVO = @param1',
  })
  query: string;

  @ApiProperty({
    description: 'Query parameters (optional)',
    example: ['S'],
    required: false,
  })
  params?: any[];
}
