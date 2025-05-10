"use client";

import { useEffect, useState } from "react";
import { listarChamados, salvarChamado, excluirChamado } from "@/lib/chamadosService";

type Chamado = {
  id: number;
  cliente: string;
  equipamento: string;
  tipo: "notebook" | "computador" | "impressora";
  modelo: string;
  problema: string;
  solucao: string;
  status: "aberto" | "em andamento" | "finalizado";
};

export default function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      const lista = await listarChamados();
      setChamados(lista);
    }
    carregar();
  }, []);

  const criarChamado = async () => {
    const novo: Omit<Chamado, "id"> = {
      cliente: "",
      equipamento: "",
      tipo: "computador",
      modelo: "",
      problema: "",
      solucao: "",
      status: "aberto",
    };
    const chamadoComId = { ...novo, id: Date.now() };
    await salvarChamado(chamadoComId);
    const atualizados = await listarChamados();
    setChamados(atualizados);
  };

  const atualizarChamado = async (
    id: number,
    campo: keyof Chamado,
    valor: any
  ) => {
    const atualizado = chamados.map((c) =>
      c.id === id ? { ...c, [campo]: valor } : c
    );
    setChamados(atualizado);
    const editado = atualizado.find((c) => c.id === id);
    if (editado) await salvarChamado(editado);
  };

  const getStatusColor = (status: Chamado["status"]) => {
    switch (status) {
      case "aberto":
        return "bg-red-500";
      case "em andamento":
        return "bg-yellow-400";
      case "finalizado":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Chamados</h2>
      <button
        onClick={criarChamado}
        className="bg-sky-800 px-4 py-2 rounded mb-4"
      >
        Novo Chamado
      </button>

      {chamados.map((c) => (
        <div
          key={c.id}
          className="mb-4 p-4 bg-zinc-800 rounded border border-sky-800 cursor-pointer"
          onClick={() =>
            setExpandedId((prev) => (prev === c.id ? null : c.id))
          }
        >
          <div className="flex justify-between items-center">
            <div>
              <strong>#{c.id}</strong> — {c.cliente} ({c.tipo}) — {c.equipamento}
            </div>
            <span
              className={`w-3 h-3 rounded-full ${getStatusColor(c.status)}`}
            ></span>
          </div>

          {expandedId === c.id && (
            <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
              <input
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.cliente}
                onChange={(e) => atualizarChamado(c.id, "cliente", e.target.value)}
                placeholder="Nome do Cliente"
              />
              <select
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.tipo}
                onChange={(e) =>
                  atualizarChamado(c.id, "tipo", e.target.value as Chamado["tipo"])
                }
              >
                <option value="notebook">Notebook</option>
                <option value="computador">Computador</option>
                <option value="impressora">Impressora</option>
              </select>
              <input
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.equipamento}
                onChange={(e) =>
                  atualizarChamado(c.id, "equipamento", e.target.value)
                }
                placeholder="Nome do Equipamento"
              />
              <input
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.modelo}
                onChange={(e) => atualizarChamado(c.id, "modelo", e.target.value)}
                placeholder="Modelo"
              />
              <textarea
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.problema}
                onChange={(e) =>
                  atualizarChamado(c.id, "problema", e.target.value)
                }
                placeholder="Descrição do Problema"
              />
              <textarea
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.solucao}
                onChange={(e) =>
                  atualizarChamado(c.id, "solucao", e.target.value)
                }
                placeholder="Descrição da Solução"
              />
              <select
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value={c.status}
                onChange={(e) =>
                  atualizarChamado(
                    c.id,
                    "status",
                    e.target.value as Chamado["status"]
                  )
                }
              >
                <option value="aberto">Aberto</option>
                <option value="em andamento">Em andamento</option>
                <option value="finalizado">Finalizado</option>
              </select>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const confirm = window.confirm("Deseja excluir este chamado?");
                  if (confirm) {
                    excluirChamado(c.id);
                    setChamados(chamados.filter((item) => item.id !== c.id));
                    setExpandedId(null);
                  }
                }}
                className="bg-red-800 px-4 py-2 rounded text-white mt-4"
              >
                Excluir Chamado
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
