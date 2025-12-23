import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { RhFiltersDto } from './rh-filters.dto';

/**
 * DTO para filtros específicos de relatórios de turnover
 */
export class TurnoverReportDto extends PartialType(RhFiltersDto) {
  @ApiPropertyOptional({
    description: 'Tipo de relatório',
    enum: ['geral', 'departamento', 'cargo', 'periodo'],
    example: 'departamento',
  })
  tipo?: 'geral' | 'departamento' | 'cargo' | 'periodo';
}

/**
 * DTO para análise de risco de evasão
 */
export class RiscoEvasaoDto extends PartialType(RhFiltersDto) {
  @ApiPropertyOptional({
    description: 'Nível mínimo de risco para filtrar',
    enum: ['BAIXO', 'MÉDIO', 'ALTO', 'CRÍTICO'],
    example: 'ALTO',
  })
  nivelRiscoMinimo?: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
}

/**
 * DTO para filtros de custo de rescisão
 */
export class CustoRescisaoDto extends PartialType(RhFiltersDto) {
  @ApiPropertyOptional({
    description: 'Ano específico para análise',
    example: 2024,
  })
  ano?: number;

  @ApiPropertyOptional({
    description: 'Mês específico para análise (1-12)',
    example: 12,
  })
  mes?: number;
}
