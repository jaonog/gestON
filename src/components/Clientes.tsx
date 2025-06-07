"use client";

import { useEffect, useState } from "react";
import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  excluirCliente,
} from "@/lib/clientesService";
import { listarChamados } from "@/lib/chamadosService";
import { Users, Plus, Trash2, ClipboardList, Save } from "lucide-react";

type Cliente = {
  id: number;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
};

type Chamado = {
  id: number;
  clienteId: number;
  status: string;
  problema: string;
  equipamento: {
    nome: string;
    tipo: string;
    modelo: string;
  };
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesEditados, setClientesEditados] = useState<{
    [id: number]: Cliente;
  }>({});
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [busca, setBusca] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      const [cls, chs] = await Promise.all([
        listarClientes(),
        listarChamados(),
      ]);
      setClientes(cls);
      setChamados(chs);
    }
    carregar();
  }, []);

  const adicionar = async () => {
    const novo = {
      nome: "",
      cpfCnpj: "",
      telefone: "",
      email: "",
      endereco: "",
    };
    const criado = await criarCliente(novo);
    setClientes((prev) => [...prev, criado]);
    setExpandedId(criado.id);
  };

  const editarCampo = (id: number, campo: keyof Cliente, valor: string) => {
    setClientesEditados((prev) => ({
      ...prev,
      [id]: { ...clientes.find((c) => c.id === id)!, ...prev[id], [campo]: valor },
    }));
  };

  const salvarCliente = async (id: number) => {
    const dados = clientesEditados[id];
    if (!dados) return;

    try {
      await atualizarCliente(dados);
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...dados } : c))
      );
      const atualizados = { ...clientesEditados };
      delete atualizados[id];
      setClientesEditados(atualizados);
      alert("Cliente atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar cliente");
    }
  };

  const remover = async (id: number) => {
    if (confirm("Excluir cliente?")) {
      await excluirCliente(id);
      setClientes(clientes.filter((c) => c.id !== id));
      setExpandedId(null);
    }
  };

  const filtrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users size={24} className="text-sky-400" /> Clientes
      </h2>

      <div className="flex gap-3 mb-4 items-center">
        <button
          onClick={adicionar}
          className="bg-sky-700 hover:bg-sky-800 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Novo Cliente
        </button>

        <input
          type="text"
          placeholder="Buscar cliente"
          className="p-2 bg-neutral-800 rounded"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtrados.map((c) => {
          const chamadosDoCliente = chamados.filter(
            (ch) => ch.clienteId === c.id
          );
          const dados = clientesEditados[c.id] || c;

          return (
            <div
              key={c.id}
              className="bg-zinc-800 p-4 rounded border border-sky-800 cursor-pointer"
              onClick={() =>
                setExpandedId((prev) => (prev === c.id ? null : c.id))
              }
            >
              <div className="flex justify-between items-center">
                <div className="text-sm space-x-3">
                  <strong className="text-base">
                    {dados.nome || "Novo Cliente"}
                  </strong>
                  <span className="text-zinc-400">
                    Telefone: {dados.telefone}
                  </span>
                  <span className="text-zinc-500">
                    CPF/CNPJ: {dados.cpfCnpj}
                  </span>
                </div>
              </div>
              {expandedId === c.id && (
                <div
                  className="mt-4 space-y-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={dados.nome}
                      onChange={(e) =>
                        editarCampo(c.id, "nome", e.target.value)
                      }
                      placeholder="Nome"
                      className="bg-neutral-700 p-2 rounded"
                    />
                    <input
                      value={dados.cpfCnpj}
                      onChange={(e) =>
                        editarCampo(c.id, "cpfCnpj", e.target.value)
                      }
                      placeholder="CPF/CNPJ"
                      className="bg-neutral-700 p-2 rounded"
                    />
                    <input
                      value={dados.telefone}
                      onChange={(e) =>
                        editarCampo(c.id, "telefone", e.target.value)
                      }
                      placeholder="Telefone"
                      className="bg-neutral-700 p-2 rounded"
                    />
                    <input
                      value={dados.email}
                      onChange={(e) =>
                        editarCampo(c.id, "email", e.target.value)
                      }
                      placeholder="E-mail"
                      className="bg-neutral-700 p-2 rounded"
                    />
                    <input
                      value={dados.endereco}
                      onChange={(e) =>
                        editarCampo(c.id, "endereco", e.target.value)
                      }
                      placeholder="Endereço"
                      className="col-span-2 bg-neutral-700 p-2 rounded"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => salvarCliente(c.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Save size={14} /> Salvar
                    </button>

                    <button
                      onClick={() => remover(c.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-sky-300 flex items-center gap-1 mb-2">
                      <ClipboardList size={16} /> Chamados do Cliente
                    </h3>
                    {chamadosDoCliente.length === 0 ? (
                      <p className="text-sm text-zinc-400">
                        Nenhum chamado encontrado.
                      </p>
                    ) : (
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {chamadosDoCliente.map((ch) => (
                          <li key={ch.id}>
                            #{ch.id} - {ch.equipamento?.nome || "Equipamento"} -{" "}
                            <span className="text-sky-400">{ch.status}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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
