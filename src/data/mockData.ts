import { BoletimData, defaultColumns, defaultAssinaturas } from '@/types/boletim';

export const mockBoletimData: BoletimData = {
  header: {
    anexo: 'Anexo 8 - Boletim de – PNR-000043 – Rev. 01: 06-06-2025',
    titulo: 'BOLETIM DE MEDIÇÃO',
    logoUrl: '',
    gerenciaArea: 'DFIN/DIMB',
    gerenciaGeral: 'TSA BH SEDE',
    contratoNumero: '5900098356 / 5500094054',
    contratadaCnpj: 'TSA - Tecnologia de Sistemas de Automação S/A',
    objeto: 'Equipe de apoio para o Pátio Autônomo do S11D - Roberval',
    dataEnvio: '14/01/2026',
    gestorContrato: 'Pablo Almeida',
    localPrestacao: 'Canaã dos Carajás',
    periodo: '21/06/2025 a 20/07/2025',
    medicaoNumero: '013',
  },
  items: Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    linhaQQP: String(i + 1),
    descricao: `Serviço Técnico ${i + 1} - ${['Coordenador', 'Engenheiro', 'Técnico', 'Analista', 'Supervisor'][i % 5]} ${['Senior', 'Pleno', 'Junior'][i % 3]}`,
    unidadeMedida: ['serv/mês', 'hora', 'Vb', 'und'][i % 4],
    precoUnitario: Math.round((5000 + Math.random() * 25000) * 100) / 100,
    quantidade: Math.round((0.1 + Math.random() * 2) * 1000) / 1000,
    valorTotal: Math.round((1000 + Math.random() * 10000) * 100) / 100,
  })),
  columns: defaultColumns,
  assinaturas: defaultAssinaturas,
  valorTotal: 0,
};
