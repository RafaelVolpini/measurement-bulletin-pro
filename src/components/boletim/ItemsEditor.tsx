import React from "react";
import { BoletimItem, BoletimColumn } from "@/types/boletim";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemsEditorProps {
  items: BoletimItem[];
  columns: BoletimColumn[];
  onChange: (items: BoletimItem[]) => void;
}

/**
 * Se seu front e API estiverem no mesmo host, "/itens" funciona.
 * Se não, troque para "http://172.16.3.21:3000/itens".
 */
const ITENS_ENDPOINT = "http://172.16.3.21:3000/itens";

/**
 * Unidades permitidas no dropdown.
 * Você disse que são só essas 3; mantive exatamente assim.
 * Se quiser permitir HH também, adicione "HH" aqui.
 */
const UNIDADES_MEDIDA = ["gl", "un", "serv/mes"] as const;
type UnidadeMedida = (typeof UNIDADES_MEDIDA)[number];

type ItemCatalogoApi = {
  id: number;
  linha_do_qqp: string;
  descricao: string;
  unidade: string;
  preco_unitario: string;
  quantidade: string;
  valor_total: string;
};

// Larguras RESPONSIVAS em % (somam 100% com actions)
const COL_WIDTHS_PERCENT: Partial<Record<BoletimColumn["key"] | "actions", string>> = {
  linhaQQP: "14%",
  descricao: "34%",
  unidadeMedida: "10%",
  precoUnitario: "14%",
  quantidade: "10%",
  valorTotal: "12%",
  actions: "6%",
};

function ColGroup({ visibleColumns }: { visibleColumns: BoletimColumn[] }) {
  return (
    <colgroup>
      {visibleColumns.map((col) => (
        <col key={col.id} style={{ width: COL_WIDTHS_PERCENT[col.key] ?? "auto" }} />
      ))}
      <col style={{ width: COL_WIDTHS_PERCENT.actions }} />
    </colgroup>
  );
}

function isLeftAligned(key: BoletimColumn["key"]) {
  return key === "linhaQQP" || key === "descricao";
}

function normalizeUnidade(raw: string): UnidadeMedida | "" {
  const v = (raw ?? "").trim().toLowerCase();

  if (v === "gl") return "gl";
  if (v === "un" || v === "u.n" || v === "unidade") return "un";

  // normaliza "serv/mês" -> "serv/mes"
  if (v === "serv/mês" || v === "serv/mes" || v === "serviço/mês" || v === "servico/mes") {
    return "serv/mes";
  }

  // não permitido pela lista atual
  return "";
}

export function ItemsEditor({ items, columns, onChange }: ItemsEditorProps) {
  const visibleColumns = columns.filter((col) => col.visible);

  const [catalogo, setCatalogo] = React.useState<ItemCatalogoApi[]>([]);
  const [catalogoLoading, setCatalogoLoading] = React.useState(false);
  const [catalogoError, setCatalogoError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setCatalogoLoading(true);
      setCatalogoError(null);
      try {
        const res = await fetch(ITENS_ENDPOINT);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ItemCatalogoApi[];
        if (!cancelled) setCatalogo(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setCatalogoError("Não foi possível carregar itens do QQP.");
      } finally {
        if (!cancelled) setCatalogoLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = () => {
    const newItem: BoletimItem = {
      id: `item-${Date.now()}`,
      linhaQQP: "",
      descricao: "",
      unidadeMedida: "",
      precoUnitario: 0,
      quantidade: 0,
      valorTotal: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    onChange(items.filter((item) => item.id !== itemId));
  };

  const updateItem = (
    itemId: string,
    field: keyof BoletimItem,
    value: string | number,
  ) => {
    onChange(
      items.map((item) => {
        if (item.id !== itemId) return item;

        const updatedItem = { ...item, [field]: value };

        // Recalculate valorTotal if precoUnitario or quantidade changes
        if (field === "precoUnitario" || field === "quantidade") {
          const preco =
            field === "precoUnitario" ? Number(value) : item.precoUnitario;
          const qtd = field === "quantidade" ? Number(value) : item.quantidade;
          updatedItem.valorTotal = Number((preco * qtd).toFixed(2));
        }

        return updatedItem;
      }),
    );
  };

  const applyCatalogoToItem = (itemId: string, linhaDoQqp: string) => {
    const selected = catalogo.find((c) => String(c.linha_do_qqp) === String(linhaDoQqp));
    if (!selected) {
      updateItem(itemId, "linhaQQP", linhaDoQqp);
      return;
    }

    const preco = Number(selected.preco_unitario) || 0;
    const unidade = normalizeUnidade(selected.unidade);

    onChange(
      items.map((item) => {
        if (item.id !== itemId) return item;

        const quantidadeAtual = Number(item.quantidade) || 0;
        const valorTotal = Number((preco * quantidadeAtual).toFixed(2));

        return {
          ...item,
          linhaQQP: String(selected.linha_do_qqp),
          descricao: selected.descricao ?? "",
          unidadeMedida: unidade, // se não for permitido, vira ""
          precoUnitario: preco,
          valorTotal,
        };
      }),
    );
  };

  const totalValue = items.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between shrink-0">
        <div>
          <CardTitle className="text-base">Itens da Medição</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {items.length} itens cadastrados
          </p>
          {catalogoError ? (
            <p className="text-xs text-destructive mt-1">{catalogoError}</p>
          ) : null}
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
            <table className="w-full text-sm min-w-[700px] table-fixed">
              <ColGroup visibleColumns={visibleColumns} />
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  {visibleColumns.map((col) => (
                    <th
                      key={col.id}
                      className={[
                        "p-4 font-medium text-muted-foreground text-xs whitespace-nowrap",
                        isLeftAligned(col.key) ? "text-left" : "text-right",
                      ].join(" ")}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="p-4" />
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body */}
          <ScrollArea className="h-[300px] md:h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px] table-fixed">
                <ColGroup visibleColumns={visibleColumns} />
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + 1}
                        className="p-8 text-center text-muted-foreground"
                      >
                        Nenhum item cadastrado. Clique em "Adicionar" para
                        começar.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                      >
                        {visibleColumns.map((col) => (
                          <td key={col.id} className="p-1 align-middle">
                            {col.key === "valorTotal" ? (
                              <div className="px-2 py-1.5 text-right font-medium text-xs">
                                {formatCurrency(item.valorTotal)}
                              </div>
                            ) : col.key === "linhaQQP" ? (
                              <Select
                                value={item.linhaQQP || undefined}
                                onValueChange={(v) => applyCatalogoToItem(item.id, v)}
                              >
                                <SelectTrigger className="h-7 text-xs w-full">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {catalogoLoading ? (
                                    <SelectItem value="__loading__" disabled>
                                      Carregando...
                                    </SelectItem>
                                  ) : catalogo.length === 0 ? (
                                    <SelectItem value="__empty__" disabled>
                                      Sem itens disponíveis
                                    </SelectItem>
                                  ) : (
                                    catalogo.map((c) => (
                                      <SelectItem
                                        key={c.id}
                                        value={String(c.linha_do_qqp)}
                                      >
                                        {c.linha_do_qqp} — {c.descricao}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            ) : col.key === "unidadeMedida" ? (
                              <Select
                                value={item.unidadeMedida || undefined}
                                onValueChange={(v) =>
                                  updateItem(item.id, "unidadeMedida", v)
                                }
                              >
                                <SelectTrigger className="h-7 text-xs w-full">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {UNIDADES_MEDIDA.map((u) => (
                                    <SelectItem key={u} value={u}>
                                      {u}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={col.type === "text" ? "text" : "number"}
                                step={
                                  col.type === "currency"
                                    ? "0.01"
                                    : col.type === "number"
                                      ? "0.001"
                                      : undefined
                                }
                                value={
                                  item[col.key as keyof BoletimItem] as
                                    | string
                                    | number
                                }
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    col.key as keyof BoletimItem,
                                    col.type === "text"
                                      ? e.target.value
                                      : parseFloat(e.target.value) || 0,
                                  )
                                }
                                className={[
                                  "h-7 text-xs w-full",
                                  isLeftAligned(col.key) ? "text-left" : "text-right",
                                ].join(" ")}
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
            <table className="w-full text-sm min-w-[700px] table-fixed">
              <ColGroup visibleColumns={visibleColumns} />
              <tfoot>
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="p-3 text-right font-bold text-xs"
                  >
                    <span className="text-foreground">VALOR TOTAL:&nbsp;</span>
                    <span className="text-primary mr-4 text-sm">
                      {formatCurrency(totalValue)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
