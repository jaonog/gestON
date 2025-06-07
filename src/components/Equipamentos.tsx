"use client";

import { useEffect, useState } from "react";
import {
  listarEquipamentos,
  criarEquipamento,
  atualizarEquipamento,
  excluirEquipamento,
} from "@/lib/equipamentosService";
import { listarClientes } from "@/lib/clientesService";
import { Monitor, Plus, Trash2, Save } from "lucide-react";

type Equipamento = {
  id: number;
  clienteId: number;
  nome: string;
  tipo: "notebook" | "computador" | "impressora";
  modelo: string;
};

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [edicoes, setEdicoes] = useState<Record<number, Partial<Equipamento>>>({});

  useEffect(() => {
    async function carregar() {
      const [eqs, cls] = await Promise.all([
        listarEquipamentos(),
        listarClientes(),
      ]);
      setEquipamentos(eqs);
      setClientes(cls);
    }
    carregar();
  }, []);

  const adicionar = async () => {
    const novo = {
      clienteId: clientes[0]?.id || 0,
      nome: "",
      tipo: "notebook" as Equipamento["tipo"],
      modelo: "",
    };
    const criado = await criarEquipamento(novo);
    setEquipamentos((prev) => [...prev, criado]);
    setExpandedId(criado.id);
    setEdicoes((prev) => ({ ...prev, [criado.id]: criado }));
  };

  const handleEditar = (id: number, campo: keyof Equipamento, valor: string | number) => {
    setEdicoes((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor },
    }));
  };

  const salvar = async (id: number) => {
    const alteracoes = edicoes[id];
    if (alteracoes) {
      const atualizados = equipamentos.map((e) =>
        e.id === id ? { ...e, ...alteracoes } : e
      );
      setEquipamentos(atualizados);
      await atualizarEquipamento({ ...alteracoes, id } as Equipamento);
      setEdicoes((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const remover = async (id: number) => {
    if (confirm("Excluir equipamento?")) {
      await excluirEquipamento(id);
      setEquipamentos(equipamentos.filter((e) => e.id !== id));
      setExpandedId(null);
    }
  };

  const filtrados = equipamentos.filter((e) =>
    e.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Monitor size={24} className="text-sky-400" /> Equipamentos
      </h2>

      <div className="flex gap-3 mb-4 items-center">
        <button
          onClick={adicionar}
          className="bg-sky-700 hover:bg-sky-800 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Novo Equipamento
        </button>

        <input
          type="text"
          placeholder="Buscar equipamento"
          className="p-2 bg-neutral-800 rounded"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtrados.map((e) => {
          const cliente = clientes.find((c) => c.id === e.clienteId);
          const edicao = edicoes[e.id] || {};

          return (
            <div
              key={e.id}
              className="bg-zinc-800 p-4 rounded border border-sky-800 cursor-pointer hover:border-sky-600"
              onClick={() =>
                setExpandedId((prev) => (prev === e.id ? null : e.id))
              }
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <strong className="text-lg">
                  {e.nome || "Novo Equipamento"}
                </strong>

                <div className="text-sm text-gray-300 flex flex-wrap gap-4">
                  <span>
                    <strong>Tipo:</strong> {e.tipo}
                  </span>
                  <span>
                    <strong>Modelo:</strong> {e.modelo || "–"}
                  </span>
                  <span>
                    <strong>Cliente:</strong> {cliente?.nome || "Não definido"}
                  </span>
                </div>
              </div>

              {expandedId === e.id && (
                <div
                  className="mt-4 space-y-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    value={edicao.nome ?? e.nome}
                    onChange={(ev) => handleEditar(e.id, "nome", ev.target.value)}
                    placeholder="Nome"
                    className="w-full bg-neutral-700 p-2 rounded"
                  />

                  <select
                    value={edicao.tipo ?? e.tipo}
                    onChange={(ev) =>
                      handleEditar(e.id, "tipo", ev.target.value as Equipamento["tipo"])
                    }
                    className="w-full bg-neutral-700 p-2 rounded"
                  >
                    <option value="notebook">Notebook</option>
                    <option value="computador">Computador</option>
                    <option value="impressora">Impressora</option>
                  </select>

                  <input
                    value={edicao.modelo ?? e.modelo}
                    onChange={(ev) =>
                      handleEditar(e.id, "modelo", ev.target.value)
                    }
                    placeholder="Modelo"
                    className="w-full bg-neutral-700 p-2 rounded"
                  />

                  <select
                    value={edicao.clienteId ?? e.clienteId}
                    onChange={(ev) =>
                      handleEditar(e.id, "clienteId", parseInt(ev.target.value))
                    }
                    className="w-full bg-neutral-700 p-2 rounded"
                  >
                    {clientes.map((cli) => (
                      <option key={cli.id} value={cli.id}>
                        {cli.nome}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => salvar(e.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Save size={14} /> Salvar
                    </button>

                    <button
                      onClick={() => remover(e.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
