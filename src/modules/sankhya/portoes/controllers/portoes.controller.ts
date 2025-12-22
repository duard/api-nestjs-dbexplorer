import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PortoesService } from '../services/portoes.service';

@ApiTags('portoes')
@ApiBearerAuth()
@Controller('sankhya/portoes')
@UseGuards(AuthGuard('jwt'))
export class PortoesController {
  constructor(private readonly portoesService: PortoesService) {}

  @Get('acessos')
  @ApiQuery({ name: 'ipPortao', required: false, example: '192.168.1.100' })
  @ApiQuery({ name: 'usuario', required: false, example: 'joao.silva' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 20 })
  async getPortoesAcessos(
    @Query('ipPortao') ipPortao?: string,
    @Query('usuario') usuario?: string,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '20',
  ) {
    return this.portoesService.getPortoesAcessos(
      ipPortao,
      usuario,
      parseInt(page, 10) || 1,
      parseInt(perPage, 10) || 20,
    );
  }

  @Get('ultimos')
  @ApiQuery({ name: 'usuario', required: false, example: 'joao.silva' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 20 })
  async getUltimosAcessos(
    @Query('usuario') usuario?: string,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '20',
  ) {
    return this.portoesService.getUltimosAcessos(
      usuario,
      parseInt(page, 10) || 1,
      parseInt(perPage, 10) || 20,
    );
  }

  @Get('portao/:id')
  @ApiQuery({ name: 'usuario', required: false, example: 'joao.silva' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 20 })
  async getAcessosByPortaoId(
    @Param('id') id: string,
    @Query('usuario') usuario?: string,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '20',
  ) {
    return this.portoesService.getAcessosByPortaoId(
      id,
      usuario,
      parseInt(page, 10) || 1,
      parseInt(perPage, 10) || 20,
    );
  }
}
