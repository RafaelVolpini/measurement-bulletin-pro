import React, { useState, useRef } from 'react';
import { BoletimData } from '@/types/boletim';
import { mockBoletimData } from '@/data/mockData';
import { BoletimPDF } from '@/components/boletim/BoletimPDF';
import { HeaderEditor } from '@/components/boletim/HeaderEditor';
import { ColumnEditor } from '@/components/boletim/ColumnEditor';
import { ItemsEditor } from '@/components/boletim/ItemsEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileDown, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Eye,
  FileText
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function BoletimEditor() {
  const [data, setData] = useState<BoletimData>(mockBoletimData);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'config'>('preview');
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Boletim de Medição</h1>
              <p className="text-sm text-muted-foreground">Editor Configurável</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Tela Cheia
            </Button>
            <Button onClick={exportToPDF} disabled={isExporting}>
              <FileDown className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'config')}>
          <TabsList className="mb-6">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visualização
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex justify-center">
              <div ref={!isFullscreen ? pdfRef : undefined} className="shadow-xl border rounded-lg overflow-hidden">
                <BoletimPDF data={data} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <HeaderEditor header={data.header} onChange={handleHeaderChange} />
                <ColumnEditor columns={data.columns} onChange={handleColumnsChange} />
              </div>
              <div>
                <ItemsEditor 
                  items={data.items} 
                  columns={data.columns}
                  onChange={handleItemsChange} 
                />
              </div>
            </div>

            {/* Preview Panel in Config */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
              <div className="flex justify-center">
                <div className="shadow-xl border rounded-lg overflow-hidden scale-75 origin-top">
                  <BoletimPDF data={data} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
