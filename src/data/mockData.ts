import { BoletimData, defaultColumns, defaultAssinaturas } from '@/types/boletim';

export const mockBoletimData: BoletimData = {
  header: {
    anexo: 'Anexo 8 - Boletim de – PNR-000043 – Rev. 01: 06-06-2025',
    titulo: 'BOLETIM DE MEDIÇÃO',
    logoUrl: '',
    gerenciaArea: 'DFIN/DIMB',
    gerenciaGeral: 'Gerencia Regional TI Norte',
    contratoNumero: '5900098356 / 5500094054',
    contratadaCnpj: 'TSA - Tecnologia de Sistemas de Automação S/A',
    objeto: 'Equipe de apoio para o Pátio Autônomo do S11D - Roberval',
    dataEnvio: '14/01/2026',
    gestorContrato: 'Pablo Almeida',
    localPrestacao: 'Canaã dos Carajás',
    periodo: '21/06/2025 a 20/07/2025',
    medicaoNumero: '013',
  },
  // Start with no prefilled items (user adds them in the editor)
  items: [],
  columns: defaultColumns,
  assinaturas: defaultAssinaturas,
  valorTotal: 0,
};
