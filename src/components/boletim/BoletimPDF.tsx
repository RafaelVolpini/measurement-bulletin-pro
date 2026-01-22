import React from 'react';
import { BoletimData } from '@/types/boletim';
import { BoletimLogo } from './BoletimLogo';
import { formatCurrency, formatNumber } from '@/lib/format';

interface BoletimPDFProps {
  data: BoletimData;
  className?: string;
}

const ITEMS_PER_PAGE = 10;

export function BoletimPDF({ data, className = '' }: BoletimPDFProps) {
  const { header, items, columns, assinaturas } = data;
  const visibleColumns = columns.filter(col => col.visible);
  
  // Calculate total from items
  const calculatedTotal = items.reduce((sum, item) => sum + item.valorTotal, 0);
  
  // Paginate items
  const pages: typeof items[] = [];
  if (items.length === 0) {
    pages.push([]);
  } else {
    for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
      pages.push(items.slice(i, i + ITEMS_PER_PAGE));
    }
  }

  const renderValue = (item: typeof items[0], col: typeof columns[0]) => {
    const value = item[col.key as keyof typeof item];
    if (col.type === 'currency') {
      if (typeof value === 'number') {
        return value === 0 ? '-' : formatCurrency(value);
      }
      return '-';
    }
    if (col.type === 'number') {
      if (typeof value === 'number') {
        return value === 0 ? '-' : formatNumber(value);
      }
      return '-';
    }
    return value || '';
  };

  return (
    <div className={`pdf-document bg-white text-gray-900 ${className}`}>
      {pages.map((pageItems, pageIndex) => (
        <div 
          key={pageIndex} 
          // Slightly under A4 height to avoid html2pdf/jsPDF rounding creating
          // a trailing empty page when total height is an exact multiple.
          className="pdf-page relative box-border w-[210mm] h-[296.5mm] mx-auto p-[10mm]"
        >
          {/* Anexo Header */}
          <div className="text-xs text-gray-600 mb-4">
            {header.anexo}
          </div>

          {/* Title */}
          <div className="border-2 border-gray-400 mb-4">
            <div className="text-center py-3 font-bold text-lg border-b-2 border-gray-400">
              {header.titulo}
            </div>

            {/* Logo and Gerência Row */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="p-4 flex items-center justify-center border-r border-gray-300">
                <BoletimLogo logoUrl={header.logoUrl} />
              </div>
              <div className="p-3 flex items-center justify-center border-r border-gray-300 font-semibold">
                {header.gerenciaArea}
              </div>
              <div className="p-3 flex items-center justify-center font-semibold">
                {header.gerenciaGeral}
              </div>
            </div>

            {/* Contract Info Row 1 */}
            <div className="grid grid-cols-[1fr_2fr_3fr] border-b border-gray-300 text-sm">
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-semibold text-gray-600">Contrato Nº:</div>
                <div>{header.contratoNumero}</div>
              </div>
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-semibold text-gray-600">Contratada / CNPJ:</div>
                <div>{header.contratadaCnpj}</div>
              </div>
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-600">Objeto:</div>
                <div>{header.objeto}</div>
              </div>
            </div>

            {/* Contract Info Row 2 */}
            <div className="grid grid-cols-4 text-sm">
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-semibold text-gray-600">Data de envio:</div>
                <div>{header.dataEnvio}</div>
              </div>
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-semibold text-gray-600">Gestor do Contrato:</div>
                <div>{header.gestorContrato}</div>
              </div>
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-semibold text-gray-600">Local de prestação do serviço:</div>
                <div>{header.localPrestacao}</div>
              </div>
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-600">Período:</div>
                <div>{header.periodo}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="pdf-table w-full mb-4 text-sm">
            <thead>
              <tr>
                {visibleColumns.map(col => (
                  <th 
                    key={col.id} 
                    className="bg-gray-100 font-semibold text-gray-800"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  {visibleColumns.map(col => (
                    <td 
                      key={col.id} 
                      className={col.type === 'currency' || col.type === 'number' ? 'text-right' : ''}
                    >
                      {renderValue(item, col)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Empty rows to fill the page */}
              {pageItems.length < ITEMS_PER_PAGE && pageIndex === pages.length - 1 && (
                Array.from({ length: ITEMS_PER_PAGE - pageItems.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    {visibleColumns.map(col => (
                      <td key={col.id} className="h-8">&nbsp;</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Total - Only on last page */}
          {pageIndex === pages.length - 1 && (
            <>
              <div className="flex border-2 border-gray-400 mb-8">
                <div className="flex-1 bg-[#D0D0D0] text-black font-bold py-3 px-4 text-center">
                  VALOR TOTAL DESTA MEDIÇÃO (R$)
                </div>
                <div className="w-32 bg-white text-right font-bold py-3 px-4 border-l-2 border-gray-400">
                  {formatCurrency(calculatedTotal)}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 mt-16 text-xs">
                {assinaturas.map((ass, idx) => (
                  <div key={idx} className="text-center">
                    <div className="border-t border-gray-400 pt-2 mb-1">
                      <div className="text-gray-500 text-[10px]">Nome Legível:</div>
                    </div>
                    <div className="text-[10px] text-gray-600 mb-2">{ass.titulo}</div>
                    <div className="text-[10px] text-gray-500">(por extenso)</div>
                    {ass.matricula !== undefined && (
                      <div className="text-[10px] text-gray-500 mt-1">Matrícula:</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Page number */}
          {pages.length > 1 && (
            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
              Página {pageIndex + 1} de {pages.length}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
