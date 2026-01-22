import React from 'react';
import { BoletimHeader } from '@/types/boletim';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage } from 'lucide-react';

interface HeaderEditorProps {
  header: BoletimHeader;
  onChange: (header: BoletimHeader) => void;
}

export function HeaderEditor({ header, onChange }: HeaderEditorProps) {
  const handleChange = (field: keyof BoletimHeader, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Configurações do Cabeçalho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo da Empresa</Label>
          <div className="flex items-center gap-4">
            {header.logoUrl ? (
              <img src={header.logoUrl} alt="Logo" className="h-12 object-contain" />
            ) : (
              <div className="h-12 w-20 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                <FileImage className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="ml-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="anexo">Anexo/Referência</Label>
            <Input
              id="anexo"
              value={header.anexo}
              onChange={(e) => handleChange('anexo', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={header.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gerenciaArea">Gerência de Área</Label>
            <Input
              id="gerenciaArea"
              value={header.gerenciaArea}
              onChange={(e) => handleChange('gerenciaArea', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gerenciaGeral">Gerência Geral</Label>
            <Input
              id="gerenciaGeral"
              value={header.gerenciaGeral}
              onChange={(e) => handleChange('gerenciaGeral', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contratoNumero">Contrato Nº</Label>
            <Input
              id="contratoNumero"
              value={header.contratoNumero}
              onChange={(e) => handleChange('contratoNumero', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contratadaCnpj">Contratada / CNPJ</Label>
            <Input
              id="contratadaCnpj"
              value={header.contratadaCnpj}
              onChange={(e) => handleChange('contratadaCnpj', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objeto">Objeto</Label>
          <Input
            id="objeto"
            value={header.objeto}
            onChange={(e) => handleChange('objeto', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataEnvio">Data de Envio</Label>
            <Input
              className="[color-scheme:light] dark:[color-scheme:dark]"
              id="dataEnvio"
              value={header.dataEnvio}
              type='date'
              onChange={(e) => handleChange('dataEnvio', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gestorContrato">Gestor do Contrato</Label>
            <Input
              id="gestorContrato"
              value={header.gestorContrato}
              onChange={(e) => handleChange('gestorContrato', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="localPrestacao">Local de Prestação</Label>
            <Input
              id="localPrestacao"
              value={header.localPrestacao}
              onChange={(e) => handleChange('localPrestacao', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodo">Período</Label>
            <Input
              id="periodo"
              type='text'
              value={header.periodo}
              onChange={(e) => handleChange('periodo', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
