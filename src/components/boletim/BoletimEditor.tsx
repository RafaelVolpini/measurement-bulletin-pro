import React, { useState, useRef } from 'react';
import { BoletimData } from '@/types/boletim';
import { mockBoletimData } from '@/data/mockData';
import { BoletimPDF } from '@/components/boletim/BoletimPDF';
import { HeaderEditor } from '@/components/boletim/HeaderEditor';
import { ColumnEditor } from '@/components/boletim/ColumnEditor';
import { ItemsEditor } from '@/components/boletim/ItemsEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileDown, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Eye,
  FileText,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function BoletimEditor() {
  const [data, setData] = useState<BoletimData>(mockBoletimData);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleHeaderChange = (header: typeof data.header) => {
    setData({ ...data, header });
  };

  const handleColumnsChange = (columns: typeof data.columns) => {
    setData({ ...data, columns });
  };

  const handleItemsChange = (items: typeof data.items) => {
    const valorTotal = items.reduce((sum, item) => sum + item.valorTotal, 0);
    setData({ ...data, items, valorTotal });
  };

  const exportToPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsExporting(true);
    
    try {
      const element = pdfRef.current;
      const opt = {
        margin: 10,
        filename: `boletim_medicao_${data.header.periodo.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between no-print">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Visualização do Boletim
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={exportToPDF} disabled={isExporting}>
              <FileDown className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Sair Tela Cheia
            </Button>
          </div>
        </div>
        <div className="p-8 flex justify-center">
          <div ref={pdfRef} className="shadow-2xl">
            <BoletimPDF data={data} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b shrink-0">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Boletim de Medição</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Editor Configurável</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden lg:flex"
            >
              {showPreview ? <PanelLeftClose className="h-4 w-4 mr-2" /> : <PanelLeft className="h-4 w-4 mr-2" />}
              {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Tela Cheia</span>
            </Button>
            <Button size="sm" onClick={exportToPDF} disabled={isExporting}>
              <FileDown className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="flex-1 flex overflow-hidden">
        {/* Config Panel */}
        <div className={`flex-1 flex flex-col overflow-hidden ${showPreview ? 'lg:max-w-[55%] xl:max-w-[50%]' : ''}`}>
          <ScrollArea className="flex-1">
            <div className="p-4 lg:p-6 space-y-4">
              {/* Config Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <HeaderEditor header={data.header} onChange={handleHeaderChange} />
                <ColumnEditor columns={data.columns} onChange={handleColumnsChange} />
              </div>
              
              {/* Items Table */}
              <ItemsEditor 
                items={data.items} 
                columns={data.columns}
                onChange={handleItemsChange} 
              />
              
              {/* Mobile Preview Toggle */}
              <div className="lg:hidden mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Ocultar Preview' : 'Visualizar PDF'}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* PDF Preview Panel */}
        {showPreview && (
          <div className="hidden lg:flex flex-col border-l bg-muted/30 w-[45%] xl:w-[50%]">
            <div className="p-3 border-b bg-background/50 shrink-0 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview em Tempo Real
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 flex justify-center">
                <div 
                  ref={pdfRef} 
                  className="shadow-xl rounded-lg overflow-hidden origin-top"
                  style={{ transform: 'scale(0.65)', transformOrigin: 'top center' }}
                >
                  <BoletimPDF data={data} />
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Preview Overlay */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-background lg:hidden overflow-auto">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-3 flex items-center justify-between">
              <span className="text-sm font-medium">Preview do PDF</span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={exportToPDF} disabled={isExporting}>
                  <FileDown className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exportando...' : 'Exportar'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  Voltar
                </Button>
              </div>
            </div>
            <div className="p-4 flex justify-center">
              <div 
                ref={pdfRef} 
                className="shadow-xl rounded-lg overflow-hidden"
                style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}
              >
                <BoletimPDF data={data} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}