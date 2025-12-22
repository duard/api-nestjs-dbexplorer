import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PortoesService } from '../services/portoes.service';

@Controller('sankhya/portoes')
@UseGuards(AuthGuard('jwt'))
export class PortoesController {
  constructor(private readonly portoesService: PortoesService) {}

  @Get('acessos')
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
