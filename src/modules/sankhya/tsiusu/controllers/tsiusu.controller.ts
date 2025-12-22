import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TsiUsuService } from '../services/tsiusu.service';

@ApiTags('tsiusu')
@Controller('tsiusu')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TsiUsuController {
  constructor(private readonly tsiUsuService: TsiUsuService) {}

  @Get(':codusu')
  @ApiOperation({ summary: 'Obter informações detalhadas do usuário por CODUSU' })
  @ApiOkResponse({ description: 'Informações detalhadas do usuário retornadas com sucesso.' })
  @ApiParam({ name: 'codusu', example: 123, description: 'Código do usuário' })
  async getUsuarioDetalhado(@Param('codusu') codusu: number) {
    return this.tsiUsuService.getUsuarioDetalhado(codusu);
  }
}
