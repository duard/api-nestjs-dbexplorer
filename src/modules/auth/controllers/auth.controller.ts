import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User authentication',
    description:
      'Authenticates user with Sankhya database credentials and returns JWT token',
  })
  @ApiBody({
    description: 'User credentials for authentication',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Username for authentication',
          example: 'CONVIDADO',
        },
        password: {
          type: 'string',
          description: 'Password for authentication',
          example: 'suasenha123',
        },
      },
      required: ['username', 'password'],
    },
  })
  @ApiOkResponse({
    description: 'Authentication successful',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNPTlZJREFTyIsInN1YiI6MzExLCJpYXQiOjE3NjY0MTA5ODUsImV4cCI6MTc2NjQxNDU4NX0.CgX2a8vXEGklmuvHO6TWPoiyAVORzcwKPnpWJziddQo',
      },
    },
  })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    const origin = req.headers['origin'] || req.headers['referer'] || 'unknown';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    console.log(`\n[LOGIN ATTEMPT] Usuário: ${loginDto.username}`);
    console.log(`  Origem: ${origin}`);
    console.log(`  IP: ${ip}`);
    console.log(`  User-Agent: ${userAgent}`);
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'Returns current authenticated user information from JWT token',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        userId: 311,
        username: 'CONVIDADO',
      },
    },
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get detailed user information',
    description:
      'Returns comprehensive information about the logged-in user including personal data, organizational structure, and manager details',
  })
  @ApiOkResponse({
    description: 'User detailed information retrieved successfully',
    schema: {
      example: {
        funcionario: {
          CODFUNC: 292,
          CODEMP: 1,
          NOMEFUNC: 'João Silva',
          funcionarioDataNascimento: '15/01/1985',
          funcionarioIdade: 40,
          funcionarioCPF: '123.456.789-00',
          CELULAR: '11987654321',
          EMAIL: 'joao.silva@empresa.com',
          funcionarioDataAdmissao: '01/03/2020',
          funcionarioDiasEmpresa: 1795,
          SITUACAO: 1,
          funcionarioSituacaoDescricao: 'Ativo',
        },
        usuario: {
          CODUSU: 292,
          NOMEUSU: 'JOAO.SILVA',
          usuarioEmail: 'joao.silva@empresa.com',
          FOTO: null,
          usuarioTelefoneCorp: '11987654321',
        },
        estruturaOrganizacional: {
          cargaHorariaDescricao: '44 horas semanais',
          departamentoDescricao: 'Tecnologia',
          cargoDescricao: 'Desenvolvedor Senior',
          centroResultadoDescricao: 'TI - Desenvolvimento',
        },
        gestor: {
          gestorCodigoUsuario: 150,
          gestorNome: 'Maria Santos',
          gestorEmail: 'maria.santos@empresa.com',
          gestorFormatado: '000150 Maria Santos',
          gestorDataNascimento: '20/06/1978',
          gestorIdade: 47,
          gestorCPF: '987.654.321-00',
          gestorCelular: '11912345678',
          gestorDepartamento: 'Tecnologia',
          gestorCargo: 'Gerente de TI',
          gestorCentroResultado: 'TI - Gestão',
          gestorDataAdmissao: '15/01/2015',
          gestorDiasEmpresa: 3650,
        },
        empresa: {
          CODEMP: 1,
          NOMEFANTASIA: 'Empresa XYZ',
          empresaCNPJ: '12.345.678/0001-90',
          empresaFormatada: '001 Empresa XYZ',
        },
      },
    },
  })
  async getMe(@Request() req) {
    return this.authService.getUserDetails(req.user.userId);
  }
}
