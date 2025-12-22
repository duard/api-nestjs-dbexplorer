import { Injectable } from '@nestjs/common';
import { SqlServerService } from '../../../../database/sqlserver.service';

@Injectable()
export class TsiUsuService {
  constructor(private readonly sqlServerService: SqlServerService) {}

  async getUsuarioDetalhado(codusu: number): Promise<any> {
    const query = `
      SELECT
        funcionarios.CODFUNC,
        funcionarios.CODEMP AS funcionarioCodEmp,
        RTRIM(LTRIM(funcionarios.NOMEFUNC)) AS NOMEFUNC,
        FORMAT(CAST(funcionarios.DTNASC AS DATE), 'dd/MM/yyyy') AS funcionarioDataNascimento,
        DATEDIFF(YEAR, CAST(funcionarios.DTNASC AS DATE), GETDATE())
          - CASE
              WHEN MONTH(CAST(funcionarios.DTNASC AS DATE)) > MONTH(GETDATE())
                OR (MONTH(CAST(funcionarios.DTNASC AS DATE)) = MONTH(GETDATE())
                AND DAY(CAST(funcionarios.DTNASC AS DATE)) > DAY(GETDATE()))
              THEN 1 ELSE 0
            END AS funcionarioIdade,
        FORMAT(funcionarios.DTADM, 'dd/MM/yyyy') AS funcionarioDataAdmissao,
        DATEDIFF(DAY, funcionarios.DTADM, GETDATE()) AS funcionarioDiasEmpresa,
        SUBSTRING(funcionarios.CPF,1,3) + '.' +
        SUBSTRING(funcionarios.CPF,4,3) + '.' +
        SUBSTRING(funcionarios.CPF,7,3) + '-' +
        SUBSTRING(funcionarios.CPF,10,2) AS funcionarioCPF,
        RTRIM(LTRIM(funcionarios.CELULAR)) AS CELULAR,
        RTRIM(LTRIM(funcionarios.EMAIL)) AS EMAIL,
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
        usuarios.CODUSU,
        RTRIM(LTRIM(usuarios.NOMEUSU)) AS NOMEUSU,
        RTRIM(LTRIM(usuarios.EMAIL)) AS usuarioEmail,
        usuarios.FOTO,
        RTRIM(LTRIM(usuarios.AD_TELEFONECORP)) AS usuarioTelefoneCorp,
        RTRIM(LTRIM(cargaHoraria.DESCRCARGAHOR)) AS cargaHorariaDescricao,
        RTRIM(LTRIM(departamento.DESCRDEP)) AS departamentoDescricao,
        RTRIM(LTRIM(COALESCE(cargo.DESCRCARGO, 'Nao informado'))) AS cargoDescricao,
        RTRIM(LTRIM(centroResultado.DESCRCENCUS)) AS centroResultadoDescricao,
        gestorUsuarios.CODUSU AS gestorCodigoUsuario,
        RTRIM(LTRIM(gestorUsuarios.NOMEUSU)) AS gestorNome,
        RTRIM(LTRIM(gestorUsuarios.EMAIL)) AS gestorEmail,
        CONCAT(
            RIGHT('000000' + CAST(gestorUsuarios.CODUSU AS VARCHAR(6)), 6),
            ' ',
            RTRIM(LTRIM(gestorUsuarios.NOMEUSU))
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
        RTRIM(LTRIM(gestorFunc.CELULAR)) AS gestorCelular,
        RTRIM(LTRIM(gestorDepto.DESCRDEP)) AS gestorDepartamento,
        RTRIM(LTRIM(COALESCE(gestorCargo.DESCRCARGO, 'Nao informado'))) AS gestorCargo,
        RTRIM(LTRIM(gestorCentroResultado.DESCRCENCUS)) AS gestorCentroResultado,
        FORMAT(gestorFunc.DTADM, 'dd/MM/yyyy') AS gestorDataAdmissao,
        DATEDIFF(DAY, gestorFunc.DTADM, GETDATE()) AS gestorDiasEmpresa,
        empresa.CODEMP AS empresaCodEmp,
        RTRIM(LTRIM(empresa.NOMEFANTASIA)) AS NOMEFANTASIA,
        SUBSTRING(empresa.CGC, 1, 2) + '.' +
        SUBSTRING(empresa.CGC, 3, 3) + '.' +
        SUBSTRING(empresa.CGC, 6, 3) + '/' +
        SUBSTRING(empresa.CGC, 9, 4) + '-' +
        SUBSTRING(empresa.CGC, 13, 2) AS empresaCNPJ,
        CONCAT(
          RIGHT('000' + CAST(empresa.CODEMP AS VARCHAR(3)), 3),
          ' ',
          RTRIM(LTRIM(empresa.NOMEFANTASIA))
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
    const params = [codusu];
    const result = await this.sqlServerService.executeSQL(query, params);
    return result && result[0] ? result[0] : null;
  }
}
