export interface BoletimHeader {
  anexo: string;
  titulo: string;
  logoUrl: string;
  gerenciaArea: string;
  gerenciaGeral: string;
  contratoNumero: string;
  contratadaCnpj: string;
  objeto: string;
  dataEnvio: string;
  gestorContrato: string;
  localPrestacao: string;
  periodo: string;
  medicaoNumero: string;
}

export interface BoletimItem {
  id: string;
  linhaQQP: string;
  descricao: string;
  unidadeMedida: string;
  precoUnitario: number;
  quantidade: number;
  valorTotal: number;
}

export interface BoletimColumn {
  id: string;
  key: keyof BoletimItem | string;
  label: string;
  visible: boolean;
  width?: string;
  type: 'text' | 'number' | 'currency';
}

export interface BoletimAssinatura {
  titulo: string;
  nomeLegivel: string;
  matricula?: string;
}

export interface BoletimData {
  header: BoletimHeader;
  items: BoletimItem[];
  columns: BoletimColumn[];
  assinaturas: BoletimAssinatura[];
  valorTotal: number;
}

export const defaultColumns: BoletimColumn[] = [
  { id: '1', key: 'linhaQQP', label: 'LINHA DO QQP', visible: true, width: '80px', type: 'text' },
  { id: '2', key: 'descricao', label: 'DESCRIÇÃO', visible: true, width: 'auto', type: 'text' },
  { id: '3', key: 'unidadeMedida', label: 'UNIDADE DE MEDIDA', visible: true, width: '100px', type: 'text' },
  { id: '4', key: 'precoUnitario', label: 'PREÇO UNITÁRIO (R$)', visible: true, width: '120px', type: 'currency' },
  { id: '5', key: 'quantidade', label: 'QUANTIDADE', visible: true, width: '100px', type: 'number' },
  { id: '6', key: 'valorTotal', label: 'VALOR TOTAL (R$)', visible: true, width: '120px', type: 'currency' },
];

export const defaultAssinaturas: BoletimAssinatura[] = [
  { titulo: 'Assinatura do Preposto da Contratada', nomeLegivel: '', matricula: '' },
  { titulo: 'Assinatura do Fiscal do Contrato', nomeLegivel: '', matricula: '' },
  { titulo: 'Assinatura do Gestor do Contrato', nomeLegivel: '', matricula: '' },
];
