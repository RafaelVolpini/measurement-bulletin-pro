import React, { useState, useRef, forwardRef } from 'react';
import { BoletimData } from '@/types/boletim';
import { mockBoletimData } from '@/data/mockData';
import { BoletimPDF } from '@/components/boletim/BoletimPDF';
import { HeaderEditor } from '@/components/boletim/HeaderEditor';
import { ColumnEditor } from '@/components/boletim/ColumnEditor';
import { ItemsEditor } from '@/components/boletim/ItemsEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Settings, Eye, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function BoletimEditor() {
  const [data, setData] = useState<BoletimData>(() => {
    const initial = { ...mockBoletimData };
    initial.valorTotal = initial.items.reduce((sum, item) => sum + item.valorTotal, 0);
    return initial;
  });
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');
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
        margin: 0,
        filename: `boletim_medicao_${data.header.periodo.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

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
            <Button size="sm" onClick={exportToPDF} disabled={isExporting}>
              <FileDown className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'config' | 'preview')} className="flex-1 flex flex-col">
        <div className="border-b bg-muted/30 px-4 lg:px-6">
          <TabsList className="h-12 bg-transparent flex gap-2">
            <TabsTrigger 
              value="config" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Settings className="h-4 w-4" />
              Configuração
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Config Tab */}
        <TabsContent value="config" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 lg:p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <HeaderEditor header={data.header} onChange={handleHeaderChange} />
                <ColumnEditor columns={data.columns} onChange={handleColumnsChange} />
              </div>
              <ItemsEditor 
                items={data.items} 
                columns={data.columns}
                onChange={handleItemsChange} 
              />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden bg-muted/30">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 lg:p-8 flex justify-center">
              <div className="shadow-2xl rounded-lg overflow-hidden">
                <div ref={pdfRef}>
                  <BoletimPDF data={data} />
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}