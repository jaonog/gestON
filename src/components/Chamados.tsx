"use client";

import { useEffect, useState } from "react";
<<<<<<< HEAD
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
=======
import {
  listarChamados,
  salvarChamado,
  excluirChamado,
} from "@/lib/chamadosService";
import { listarClientes } from "@/lib/clientesService";
import { listarEquipamentos } from "@/lib/equipamentosService";
import { ClipboardList, Plus, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ItemChamado {
  equipamentoId: number;
  problema: string;
  solucao: string;
}

interface Chamado {
  id: number;
  clienteId: number;
  tecnico: string;
  status: "aberto" | "em andamento" | "finalizado";
  data: string;
  itens: ItemChamado[];
}

interface Cliente {
  id: number;
  nome: string;
}

interface Equipamento {
  id: number;
  clienteId: number;
  tipo: string;
  modelo: string;
}

export default function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTecnico, setFiltroTecnico] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [carregandoChamado, setCarregandoChamado] = useState(false);

  useEffect(() => {
    async function carregar() {
      const [ch, cl, eq] = await Promise.all([
        listarChamados(),
        listarClientes(),
        listarEquipamentos(),
      ]);
      setChamados(ch);
      setClientes(cl);
      setEquipamentos(eq);
>>>>>>> 18c7c88 (Mudanças finais)
    }
    carregar();
  }, []);

  const criarChamado = async () => {
<<<<<<< HEAD
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
=======
    if (carregandoChamado || clientes.length === 0) return;
    setCarregandoChamado(true);
    try {
      const novo: Omit<Chamado, "id"> = {
        clienteId: clientes[0].id,
        tecnico: "Técnico 1",
        status: "aberto",
        data: new Date().toISOString(),
        itens: [],
      };
      const res = await salvarChamado(novo);
      if (!res?.id) throw new Error("Erro ao criar chamado.");
      setChamados((prev) => [...prev, res]);
      setExpandedId(res.id);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar chamado.");
    } finally {
      setCarregandoChamado(false);
    }
  };

  const atualizarCampo = (id: number, campo: keyof Chamado, valor: any) => {
    const atualizados = chamados.map((c) =>
      c.id === id ? { ...c, [campo]: valor } : c
    );
    setChamados(atualizados);
  };

  const atualizarItem = (
    chamadoId: number,
    index: number,
    campo: keyof ItemChamado,
    valor: any
  ) => {
    setChamados((prev) =>
      prev.map((c) =>
        c.id === chamadoId
          ? {
              ...c,
              itens: c.itens.map((item, i) =>
                i === index ? { ...item, [campo]: valor } : item
              ),
            }
          : c
      )
    );
  };

  const adicionarItem = (chamadoId: number) => {
    atualizarCampo(chamadoId, "itens", [
      ...(chamados.find((c) => c.id === chamadoId)?.itens || []),
      { equipamentoId: 0, problema: "", solucao: "" },
    ]);
  };

  const removerItem = (chamadoId: number, index: number) => {
    atualizarCampo(
      chamadoId,
      "itens",
      chamados
        .find((c) => c.id === chamadoId)
        ?.itens.filter((_, i) => i !== index) || []
    );
  };

  const salvar = async (chamado: Chamado) => {
    for (const item of chamado.itens) {
      if (!item.equipamentoId) {
        alert("Selecione um equipamento para todos os itens.");
        return;
      }
    }
    try {
      const salvo = await salvarChamado(chamado);
      setChamados((prev) =>
        prev.map((c) => (c.id === salvo.id ? salvo : c))
      );
      alert("Chamado salvo!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    }
  };

  const remover = async (id: number) => {
    if (confirm("Deseja excluir este chamado?")) {
      await excluirChamado(id);
      setChamados((prev) => prev.filter((c) => c.id !== id));
      setExpandedId(null);
    }
  };

  const chamadosFiltrados = chamados
    .filter((c) =>
      clientes
        .find((cli) => cli.id === c.clienteId)
        ?.nome.toLowerCase()
        .includes(busca.toLowerCase())
    )
    .filter((c) =>
      filtroTipo
        ? c.itens.some((item) =>
            equipamentos.find((e) => e.id === item.equipamentoId)?.tipo ===
            filtroTipo
          )
        : true
    )
    .filter((c) =>
      filtroTecnico
        ? c.tecnico.toLowerCase().includes(filtroTecnico.toLowerCase())
        : true
    )
    .filter((c) => (filtroData ? c.data.slice(0, 10) === filtroData : true))
    .filter((c) => (filtroStatus ? c.status === filtroStatus : true))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList size={24} className="text-sky-400" /> Chamados
      </h2>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button
          onClick={criarChamado}
          disabled={carregandoChamado}
          className={`bg-sky-700 hover:bg-sky-800 px-4 py-2 rounded flex items-center gap-2 ${
            carregandoChamado ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Plus size={16} />
          {carregandoChamado ? "Criando..." : "Novo Chamado"}
        </button>

        <input
          type="text"
          placeholder="Buscar cliente"
          className="p-2 bg-neutral-800 rounded"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 bg-neutral-800 rounded"
        >
          <option value="">Todos os tipos</option>
          <option value="notebook">Notebook</option>
          <option value="computador">Computador</option>
          <option value="impressora">Impressora</option>
        </select>
        <input
          type="text"
          placeholder="Técnico"
          className="p-2 bg-neutral-800 rounded"
          value={filtroTecnico}
          onChange={(e) => setFiltroTecnico(e.target.value)}
        />
        <input
          type="date"
          className="p-2 bg-neutral-800 rounded"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="p-2 bg-neutral-800 rounded"
        >
          <option value="">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em andamento">Em andamento</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      {chamadosFiltrados.map((c) => {
        const cliente = clientes.find((cli) => cli.id === c.clienteId);
        const equipamentosCliente = equipamentos.filter(
          (e) => e.clienteId === c.clienteId
        );

        return (
          <div
            key={c.id}
            className="mb-4 p-4 bg-zinc-800 rounded border border-sky-800"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandedId((prev) => (prev === c.id ? null : c.id))
              }
            >
              <div>
                <strong>#{c.id}</strong> — {cliente?.nome} — Técnico: {c.tecnico}
                <div className="text-sm text-gray-400">
                  {format(new Date(c.data), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </div>
              </div>
              <span
                className={`w-3 h-3 rounded-full ${
                  c.status === "aberto"
                    ? "bg-red-500"
                    : c.status === "em andamento"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
              ></span>
            </div>

            {expandedId === c.id && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <select
                    value={c.clienteId}
                    onChange={(e) =>
                      atualizarCampo(c.id, "clienteId", Number(e.target.value))
                    }
                    className="bg-neutral-700 rounded px-2 py-1 text-white"
                  >
                    {clientes.map((cli) => (
                      <option key={cli.id} value={cli.id}>
                        {cli.nome}
                      </option>
                    ))}
                  </select>

                  <select
                    value={c.status}
                    onChange={(e) =>
                      atualizarCampo(
                        c.id,
                        "status",
                        e.target.value as Chamado["status"]
                      )
                    }
                    className="bg-neutral-700 rounded px-2 py-1 text-white"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em andamento">Em andamento</option>
                    <option value="finalizado">Finalizado</option>
                  </select>

                  <input
                    type="text"
                    value={c.tecnico}
                    onChange={(e) =>
                      atualizarCampo(c.id, "tecnico", e.target.value)
                    }
                    className="bg-neutral-700 rounded px-2 py-1 text-white"
                    placeholder="Técnico"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">Itens do chamado:</h3>
                  {c.itens.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-900 p-3 rounded mt-2 border border-zinc-700"
                    >
                      <select
                        value={item.equipamentoId}
                        onChange={(e) =>
                          atualizarItem(
                            c.id,
                            idx,
                            "equipamentoId",
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-neutral-700 mb-2 px-2 py-1 rounded text-white"
                      >
                        <option value={0}>Selecione o equipamento</option>
                        {equipamentosCliente.map((eq) => (
                          <option key={eq.id} value={eq.id}>
                            {eq.tipo} - {eq.modelo}
                          </option>
                        ))}
                      </select>

                      <textarea
                        placeholder="Problema"
                        value={item.problema}
                        onChange={(e) =>
                          atualizarItem(c.id, idx, "problema", e.target.value)
                        }
                        className="w-full bg-neutral-700 rounded px-2 py-1 mb-2 text-white"
                      />

                      <textarea
                        placeholder="Solução"
                        value={item.solucao}
                        onChange={(e) =>
                          atualizarItem(c.id, idx, "solucao", e.target.value)
                        }
                        className="w-full bg-neutral-700 rounded px-2 py-1 text-white"
                      />

                      <button
                        onClick={() => removerItem(c.id, idx)}
                        className="mt-2 text-red-400 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remover item
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => adicionarItem(c.id)}
                    className="mt-2 text-sky-400"
                  >
                    + Adicionar Item
                  </button>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => salvar(c)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => remover(c.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
>>>>>>> 18c7c88 (Mudanças finais)
    </div>
  );
}
