import React from 'react';
import { BoletimItem, BoletimColumn } from '@/types/boletim';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <Card>
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Itens da Medição</CardTitle>
        <Button size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {visibleColumns.map(col => (
                  <th key={col.id} className="text-left p-2 font-medium text-muted-foreground">
                    {col.label}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  {visibleColumns.map(col => (
                    <td key={col.id} className="p-1">
                      {col.key === 'valorTotal' ? (
                        <div className="px-2 py-1.5 text-right font-medium">
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
                          className="h-8"
                        />
                      )}
                    </td>
                  ))}
                  <td className="p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50">
                <td colSpan={visibleColumns.length - 1} className="p-2 text-right font-bold">
                  VALOR TOTAL:
                </td>
                <td className="p-2 text-right font-bold text-primary">
                  R$ {formatCurrency(totalValue)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
