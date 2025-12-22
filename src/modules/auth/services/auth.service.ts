import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SqlServerService } from '../../../database/sqlserver.service';
import { sqlVarBaseToStr } from '../../../utils/sankhya/pass';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sqlServerService: SqlServerService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      console.log('[AUTH] Tentando login para usuário:', username);

      const normalizedUsername = username.toLowerCase();

      // First, check if the user exists based on the username
      const userExistenceQuery = `SELECT CODUSU, NOMEUSU, EMAIL FROM TSIUSU WHERE NOMEUSU = @param1`;
      const userExistenceParams = [normalizedUsername];
      const existingUserResult = await this.sqlServerService.executeSQL(
        userExistenceQuery,
        userExistenceParams,
      );

      if (!existingUserResult || existingUserResult.length === 0) {
        console.log('[AUTH] Usuário não encontrado:', username);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const passwordHash = sqlVarBaseToStr(username, password);

      console.log('[AUTH] Hash calculado:', passwordHash);

      const query = `SELECT CODUSU, NOMEUSU, EMAIL FROM TSIUSU WHERE NOMEUSU = @param1 AND INTERNO = @param2`;
      const params = [normalizedUsername, passwordHash];

      console.log(
        '[AUTH] Executando consulta SQL:',
        query,
        'com parâmetros:',
        params,
      );

      const result = await this.sqlServerService.executeSQL(query, params);

      if (!result || result.length === 0) {
        console.log('[AUTH] Senha inválida para o usuário:', username);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const user = result[0];
      console.log('[AUTH] Usuário autenticado:', user);

      // Query detalhada para preencher o payload do token com dados completos
      const userDetailsQuery = `
        SELECT
          usuarios.CODUSU,
          usuarios.NOMEUSU,
          usuarios.EMAIL,
          usuarios.AD_TELEFONECORP,
          funcionarios.CODFUNC,
          funcionarios.NOMEFUNC,
          funcionarios.CODEMP,
          empresa.NOMEFANTASIA AS razaoSocial,
          empresa.CGC
        FROM TSIUSU usuarios
        LEFT JOIN TFPFUN funcionarios ON usuarios.CODFUNC = funcionarios.CODFUNC AND usuarios.CODEMP = funcionarios.CODEMP
        LEFT JOIN TSIEMP empresa ON usuarios.CODEMP = empresa.CODEMP
        WHERE usuarios.CODUSU = @param1
      `;
      const userParams = [user.CODUSU];
      const userDetails = await this.sqlServerService.executeSQL(userDetailsQuery, userParams);
      const userDetail = userDetails && userDetails.length > 0 ? userDetails[0] : {};

      const payload = {
        username: user.NOMEUSU,
        sub: user.CODUSU,
        nome: user.NOMEUSU,
        email: user.EMAIL || '',
        codemp: userDetail.CODEMP || 0,
        razaoSocial: userDetail.razaoSocial || '',
        codfunc: userDetail.CODFUNC || 0,
        nomeFuncionario: userDetail.NOMEFUNC || '',
        cgc: userDetail.CGC || '',
      };

      console.log('[AUTH] Token payload gerado:', payload);

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      console.error('[AUTH] Erro no authenticate:', err);
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  async getUserDetails(userId: number) {
    try {
      console.log('[AUTH] Buscando detalhes do usuário:', userId);

      const userDetailsQuery = `
        SELECT
          --------------------------------------------------------------------------------------
          -- 1️⃣ FUNCIONARIO · IDENTIFICAÇÃO
          --------------------------------------------------------------------------------------
          funcionarios.CODFUNC,
          funcionarios.CODEMP,
          funcionarios.NOMEFUNC,

          --------------------------------------------------------------------------------------
          -- 2️⃣ FUNCIONARIO · DADOS PESSOAIS
          --------------------------------------------------------------------------------------
          FORMAT(CAST(funcionarios.DTNASC AS DATE), 'dd/MM/yyyy') AS funcionarioDataNascimento,

          DATEDIFF(YEAR, CAST(funcionarios.DTNASC AS DATE), GETDATE())
              - CASE
                  WHEN MONTH(CAST(funcionarios.DTNASC AS DATE)) > MONTH(GETDATE())
                    OR (MONTH(CAST(funcionarios.DTNASC AS DATE)) = MONTH(GETDATE())
                    AND DAY(CAST(funcionarios.DTNASC AS DATE)) > DAY(GETDATE()))
                  THEN 1 ELSE 0
                END AS funcionarioIdade,

          SUBSTRING(funcionarios.CPF,1,3) + '.' +
          SUBSTRING(funcionarios.CPF,4,3) + '.' +
          SUBSTRING(funcionarios.CPF,7,3) + '-' +
          SUBSTRING(funcionarios.CPF,10,2) AS funcionarioCPF,

          funcionarios.CELULAR,
          funcionarios.EMAIL,

          --------------------------------------------------------------------------------------
          -- 3️⃣ FUNCIONARIO · VÍNCULO / SITUAÇÃO
          --------------------------------------------------------------------------------------
          FORMAT(funcionarios.DTADM, 'dd/MM/yyyy') AS funcionarioDataAdmissao,
          DATEDIFF(DAY, funcionarios.DTADM, GETDATE()) AS funcionarioDiasEmpresa,
          funcionarios.SITUACAO,

          CASE funcionarios.SITUACAO
              WHEN 0 THEN 'Demitido'
              WHEN 1 THEN 'Ativo'
              WHEN 2 THEN 'Afastado sem remuneracao'
              WHEN 3 THEN 'Afastado por acidente de trabalho'
              WHEN 4 THEN 'Afastado para servico militar'
              WHEN 5 THEN 'Afastado por licenca gestante'
              WHEN 6 THEN 'Afastado por doenca acima de 15 dias'
              WHEN 8 THEN 'Transferido'
              WHEN 9 THEN 'Aposentadoria por Invalidez'
              ELSE 'Situacao nao identificada'
          END AS funcionarioSituacaoDescricao,

          --------------------------------------------------------------------------------------
          -- 4️⃣ USUÁRIO SANKHYA
          --------------------------------------------------------------------------------------
          usuarios.CODUSU,
          usuarios.NOMEUSU,
          usuarios.EMAIL AS usuarioEmail,
          usuarios.FOTO,
          usuarios.AD_TELEFONECORP AS usuarioTelefoneCorp,

          --------------------------------------------------------------------------------------
          -- 5️⃣ ESTRUTURA ORGANIZACIONAL
          --------------------------------------------------------------------------------------
          cargaHoraria.DESCRCARGAHOR AS cargaHorariaDescricao,
          departamento.DESCRDEP AS departamentoDescricao,
          COALESCE(cargo.DESCRCARGO, 'Nao informado') AS cargoDescricao,
          centroResultado.DESCRCENCUS AS centroResultadoDescricao,

          --------------------------------------------------------------------------------------
          -- 6️⃣ GESTOR
          --------------------------------------------------------------------------------------
          gestorUsuarios.CODUSU AS gestorCodigoUsuario,
          gestorUsuarios.NOMEUSU AS gestorNome,
          gestorUsuarios.EMAIL AS gestorEmail,

          CONCAT(
              RIGHT('000000' + CAST(gestorUsuarios.CODUSU AS VARCHAR(6)), 6),
              ' ',
              gestorUsuarios.NOMEUSU
          ) AS gestorFormatado,

          FORMAT(CAST(gestorFunc.DTNASC AS DATE), 'dd/MM/yyyy') AS gestorDataNascimento,

          DATEDIFF(YEAR, CAST(gestorFunc.DTNASC AS DATE), GETDATE())
              - CASE
                  WHEN MONTH(CAST(gestorFunc.DTNASC AS DATE)) > MONTH(GETDATE())
                    OR (MONTH(CAST(gestorFunc.DTNASC AS DATE)) = MONTH(GETDATE())
                    AND DAY(CAST(gestorFunc.DTNASC AS DATE)) > DAY(GETDATE()))
                  THEN 1 ELSE 0
                END AS gestorIdade,

          SUBSTRING(gestorFunc.CPF,1,3) + '.' +
          SUBSTRING(gestorFunc.CPF,4,3) + '.' +
          SUBSTRING(gestorFunc.CPF,7,3) + '-' +
          SUBSTRING(gestorFunc.CPF,10,2) AS gestorCPF,

          gestorFunc.CELULAR AS gestorCelular,
          gestorDepto.DESCRDEP AS gestorDepartamento,
          COALESCE(gestorCargo.DESCRCARGO, 'Nao informado') AS gestorCargo,
          gestorCentroResultado.DESCRCENCUS AS gestorCentroResultado,
          FORMAT(gestorFunc.DTADM, 'dd/MM/yyyy') AS gestorDataAdmissao,
          DATEDIFF(DAY, gestorFunc.DTADM, GETDATE()) AS gestorDiasEmpresa,

          --------------------------------------------------------------------------------------
          -- 7️⃣ EMPRESA
          --------------------------------------------------------------------------------------
          empresa.CODEMP,
          empresa.NOMEFANTASIA,

          SUBSTRING(empresa.CGC, 1, 2) + '.' +
          SUBSTRING(empresa.CGC, 3, 3) + '.' +
          SUBSTRING(empresa.CGC, 6, 3) + '/' +
          SUBSTRING(empresa.CGC, 9, 4) + '-' +
          SUBSTRING(empresa.CGC, 13, 2) AS empresaCNPJ,

          CONCAT(
              RIGHT('000' + CAST(empresa.CODEMP AS VARCHAR(3)), 3),
              ' ',
              empresa.NOMEFANTASIA
          ) AS empresaFormatada

        FROM TFPFUN funcionarios
        JOIN TSIUSU usuarios
            ON funcionarios.CODEMP = usuarios.CODEMP
           AND funcionarios.CODFUNC = usuarios.CODFUNC
        JOIN TFPDEP departamento
            ON departamento.CODDEP = funcionarios.CODDEP
        JOIN TFPCAR cargo
            ON cargo.CODCARGO = funcionarios.CODCARGO
        JOIN TSICUS centroResultado
            ON centroResultado.CODCENCUS = usuarios.CODCENCUSPAD
        JOIN TSIUSU gestorUsuarios
            ON gestorUsuarios.CODUSU = centroResultado.CODUSURESP
        LEFT JOIN TFPFUN gestorFunc
            ON gestorFunc.CODEMP = gestorUsuarios.CODEMP
           AND gestorFunc.CODFUNC = gestorUsuarios.CODFUNC
        LEFT JOIN TFPDEP gestorDepto
            ON gestorDepto.CODDEP = gestorFunc.CODDEP
        LEFT JOIN TFPCAR gestorCargo
            ON gestorCargo.CODCARGO = gestorFunc.CODCARGO
        LEFT JOIN TSICUS gestorCentroResultado
            ON gestorCentroResultado.CODCENCUS = gestorUsuarios.CODCENCUSPAD
        JOIN TSIEMP empresa
            ON empresa.CODEMP = funcionarios.CODEMP
        LEFT JOIN TFPCGH cargaHoraria
            ON cargaHoraria.CODCARGAHOR = funcionarios.CODCARGAHOR

        WHERE usuarios.CODUSU = @param1
      `;

      const params = [userId];
      const result = await this.sqlServerService.executeSQL(
        userDetailsQuery,
        params,
      );

      if (!result || result.length === 0) {
        console.log('[AUTH] Nenhum dado encontrado para o usuário:', userId);
          const error: any = new Error('Dados do usuário não encontrados');
          error.statusCode = 404;
          throw error;
      }

      const userData = result[0];

      const organizedData = {
        funcionario: {
          CODFUNC: userData.CODFUNC,
          CODEMP: userData.CODEMP,
          NOMEFUNC: userData.NOMEFUNC,
          funcionarioDataNascimento: userData.funcionarioDataNascimento,
          funcionarioIdade: userData.funcionarioIdade,
          funcionarioCPF: userData.funcionarioCPF,
          CELULAR: userData.CELULAR,
          EMAIL: userData.EMAIL,
          funcionarioDataAdmissao: userData.funcionarioDataAdmissao,
          funcionarioDiasEmpresa: userData.funcionarioDiasEmpresa,
          SITUACAO: userData.SITUACAO,
          funcionarioSituacaoDescricao: userData.funcionarioSituacaoDescricao,
        },
        usuario: {
          CODUSU: userData.CODUSU,
          NOMEUSU: userData.NOMEUSU,
          usuarioEmail: userData.usuarioEmail,
          FOTO: userData.FOTO,
          usuarioTelefoneCorp: userData.usuarioTelefoneCorp,
        },
        estruturaOrganizacional: {
          cargaHorariaDescricao: userData.cargaHorariaDescricao,
          departamentoDescricao: userData.departamentoDescricao,
          cargoDescricao: userData.cargoDescricao,
          centroResultadoDescricao: userData.centroResultadoDescricao,
        },
        gestor: {
          gestorCodigoUsuario: userData.gestorCodigoUsuario,
          gestorNome: userData.gestorNome,
          gestorEmail: userData.gestorEmail,
          gestorFormatado: userData.gestorFormatado,
          gestorDataNascimento: userData.gestorDataNascimento,
          gestorIdade: userData.gestorIdade,
          gestorCPF: userData.gestorCPF,
          gestorCelular: userData.gestorCelular,
          gestorDepartamento: userData.gestorDepartamento,
          gestorCargo: userData.gestorCargo,
          gestorCentroResultado: userData.gestorCentroResultado,
          gestorDataAdmissao: userData.gestorDataAdmissao,
          gestorDiasEmpresa: userData.gestorDiasEmpresa,
        },
        empresa: {
          CODEMP: userData.CODEMP,
          NOMEFANTASIA: userData.NOMEFANTASIA,
          empresaCNPJ: userData.empresaCNPJ,
          empresaFormatada: userData.empresaFormatada,
        },
      };

      console.log(
        '[AUTH] Detalhes do usuário recuperados com sucesso para:',
        userId,
      );
      return organizedData;
    } catch (error) {
      console.error('[AUTH] Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  }
}
