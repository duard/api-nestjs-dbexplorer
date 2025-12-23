import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para filtros de turnover e análises de RH
 * Validação automática com class-validator
 */
export class RhFiltersDto {
  @ApiPropertyOptional({
    description: 'Data início do período (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data fim do período (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({
    description: 'Código(s) da empresa (CSV: "1,2,3")',
    example: '1,2,3',
  })
  @IsOptional()
  @IsString()
  codemp?: string;

  @ApiPropertyOptional({
    description: 'Código(s) do departamento (CSV: "10,20,30")',
    example: '10,20,30',
  })
  @IsOptional()
  @IsString()
  coddep?: string;

  @ApiPropertyOptional({
    description: 'Código(s) do cargo (CSV: "100,200")',
    example: '100,200',
  })
  @IsOptional()
  @IsString()
  codcargo?: string;

  @ApiPropertyOptional({
    description: 'Código(s) do funcionário (CSV: "123,456") - REQUER codemp',
    example: '123,456',
  })
  @IsOptional()
  @IsString()
  codfunc?: string;

  @ApiPropertyOptional({
    description: 'Ignorar empresas (CSV: "1,2,3")',
    example: '1,2,3',
  })
  @IsOptional()
  @IsString()
  ignorarEmpresas?: string;

  @ApiPropertyOptional({
    description: 'Ignorar departamentos (CSV: "10,20,30")',
    example: '10,20,30',
  })
  @IsOptional()
  @IsString()
  ignorarDepartamentos?: string;

  @ApiPropertyOptional({
    description: 'Ignorar funcionários (CSV: "100,200") - REQUER codemp',
    example: '100,200',
  })
  @IsOptional()
  @IsString()
  ignorarFuncionarios?: string;

  @ApiPropertyOptional({
    description: 'Ignorar cargos (CSV: "100,200")',
    example: '100,200',
  })
  @IsOptional()
  @IsString()
  ignorarCargos?: string;

  @ApiPropertyOptional({
    description: 'Agrupar resultados por',
    enum: ['mes', 'departamento', 'cargo', 'empresa', 'nenhum'],
    example: 'mes',
  })
  @IsOptional()
  @IsIn(['mes', 'departamento', 'cargo', 'empresa', 'nenhum'])
  agruparPor?: 'mes' | 'departamento' | 'cargo' | 'empresa' | 'nenhum';
}

/**
 * DTO para validação de query parameters
 */
export class RhQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página (paginação)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'DTDEM',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';
}
