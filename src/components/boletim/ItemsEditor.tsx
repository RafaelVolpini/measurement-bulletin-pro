import React from 'react';
import { BoletimItem, BoletimColumn } from '@/types/boletim';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface ItemsEditorProps {
  items: BoletimItem[];
  columns: BoletimColumn[];
  onChange: (items: BoletimItem[]) => void;
}

export function ItemsEditor({ items, columns, onChange }: ItemsEditorProps) {
  const visibleColumns = columns.filter(col => col.visible);

  const addItem = () => {
    const newItem: BoletimItem = {
      id: `item-${Date.now()}`,
      linhaQQP: '',
      descricao: '',
      unidadeMedida: '',
      precoUnitario: 0,
      quantidade: 0,
      valorTotal: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    onChange(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof BoletimItem, value: string | number) => {
    onChange(
      items.map(item => {
        if (item.id !== itemId) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate valorTotal if precoUnitario or quantidade changes
        if (field === 'precoUnitario' || field === 'quantidade') {
          const preco = field === 'precoUnitario' ? Number(value) : item.precoUnitario;
          const qtd = field === 'quantidade' ? Number(value) : item.quantidade;
          updatedItem.valorTotal = Number((preco * qtd).toFixed(2));
        }
        
        return updatedItem;
      })
    );
  };

  const totalValue = items.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between shrink-0">
        <div>
          <CardTitle className="text-base">Itens da Medição</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{items.length} itens cadastrados</p>
        </div>
        <Button size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="border-t">
          {/* Fixed Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  {visibleColumns.map(col => (
                    <th 
                      key={col.id} 
                      className="text-left p-2 font-medium text-muted-foreground text-xs whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="w-10 p-2"></th>
                </tr>
              </thead>
            </table>
          </div>
          
          {/* Scrollable Body */}
          <ScrollArea className="h-[300px] md:h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td 
                        colSpan={visibleColumns.length + 1} 
                        className="p-8 text-center text-muted-foreground"
                      >
                        Nenhum item cadastrado. Clique em "Adicionar" para começar.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        {visibleColumns.map(col => (
                          <td key={col.id} className="p-1">
                            {col.key === 'valorTotal' ? (
                              <div className="px-2 py-1.5 text-right font-medium text-xs">
                                {formatCurrency(item.valorTotal)}
                              </div>
                            ) : (
                              <Input
                                type={col.type === 'text' ? 'text' : 'number'}
                                step={col.type === 'currency' ? '0.01' : col.type === 'number' ? '0.001' : undefined}
                                value={item[col.key as keyof BoletimItem] as string | number}
                                onChange={(e) => updateItem(
                                  item.id,
                                  col.key as keyof BoletimItem,
                                  col.type === 'text' ? e.target.value : parseFloat(e.target.value) || 0
                                )}
                                className="h-7 text-xs"
                              />
                            )}
                          </td>
                        ))}
                        <td className="p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
          
          {/* Fixed Footer */}
          <div className="border-t bg-muted/50 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <tfoot>
                <tr>
                  <td colSpan={visibleColumns.length - 1} className="p-3 text-right font-bold text-xs">
                    VALOR TOTAL:
                  </td>
                  <td className="p-3 text-right font-bold text-primary text-sm">
                    {formatCurrency(totalValue)}
                  </td>
                  <td className="w-10"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
