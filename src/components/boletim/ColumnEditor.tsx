import React, { useState } from 'react';
import { BoletimColumn } from '@/types/boletim';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

interface ColumnEditorProps {
  columns: BoletimColumn[];
  onChange: (columns: BoletimColumn[]) => void;
}

export function ColumnEditor({ columns, onChange }: ColumnEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newColumn, setNewColumn] = useState<Partial<BoletimColumn>>({
    label: '',
    key: '',
    type: 'text',
    visible: true,
  });

  const toggleColumnVisibility = (columnId: string) => {
    onChange(
      columns.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const updateColumnLabel = (columnId: string, label: string) => {
    onChange(
      columns.map(col =>
        col.id === columnId ? { ...col, label } : col
      )
    );
  };

  const removeColumn = (columnId: string) => {
    onChange(columns.filter(col => col.id !== columnId));
  };

  const addColumn = () => {
    if (newColumn.label && newColumn.key) {
      const column: BoletimColumn = {
        id: `custom-${Date.now()}`,
        key: newColumn.key,
        label: newColumn.label,
        type: newColumn.type || 'text',
        visible: true,
      };
      onChange([...columns, column]);
      setNewColumn({ label: '', key: '', type: 'text', visible: true });
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Colunas da Tabela</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Coluna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Coluna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome da Coluna</Label>
                <Input
                  value={newColumn.label || ''}
                  onChange={(e) => setNewColumn({ ...newColumn, label: e.target.value })}
                  placeholder="Ex: OBSERVAÇÕES"
                />
              </div>
              <div className="space-y-2">
                <Label>Chave (identificador)</Label>
                <Input
                  value={newColumn.key || ''}
                  onChange={(e) => setNewColumn({ ...newColumn, key: e.target.value })}
                  placeholder="Ex: observacoes"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newColumn.type}
                  onValueChange={(value) => setNewColumn({ ...newColumn, type: value as 'text' | 'number' | 'currency' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="currency">Moeda (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addColumn} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Switch
                checked={column.visible}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              />
              <Input
                value={column.label}
                onChange={(e) => updateColumnLabel(column.id, e.target.value)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded">
                {column.type === 'currency' ? 'R$' : column.type === 'number' ? '#' : 'Abc'}
              </span>
              {column.id.startsWith('custom-') && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColumn(column.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
