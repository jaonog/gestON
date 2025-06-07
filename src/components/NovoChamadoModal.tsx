"use client";

import { useEffect, useState } from "react";
import { salvarChamado } from "@/lib/chamadosService";
import { listarClientes } from "@/lib/clientesService";
import { listarEquipamentos } from "@/lib/equipamentosService";
import { X, Plus } from "lucide-react";

export default function NovoChamadoModal({
  aberto,
  aoFechar,
  aoSalvar,
}: {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: (novoChamado: any) => void;
}) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState<number>(0);
  const [tecnico, setTecnico] = useState("Técnico 1");
  const [status, setStatus] = useState("aberto");
  const [itens, setItens] = useState([
    { equipamentoId: 0, problema: "", solucao: "" },
  ]);

  const tipoUsuario =
    typeof window !== "undefined" ? localStorage.getItem("tipo") : null;

  useEffect(() => {
    async function carregarDados() {
      const [cls, eqs] = await Promise.all([
        listarClientes(),
        listarEquipamentos(),
      ]);
      setClientes(cls);
      setEquipamentos(eqs);
      if (cls.length > 0) setClienteId(cls[0].id);
    }
    if (aberto) {
      carregarDados();
    }
  }, [aberto]);

  const equipamentosDoCliente = equipamentos.filter(
    (e) => e.clienteId === clienteId
  );

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novos = [...itens];
    novos[index] = { ...novos[index], [campo]: valor };
    setItens(novos);
  };

  const adicionarItem = () => {
    setItens([...itens, { equipamentoId: 0, problema: "", solucao: "" }]);
  };

  const removerItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const salvar = async () => {
    const novoChamado = {
      clienteId,
      tecnico,
      status,
      data: new Date().toISOString(),
      itens,
    };
    const salvo = await salvarChamado(novoChamado);
    aoSalvar(salvo);
    aoFechar();
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-xl space-y-4 relative">
        <button
          onClick={aoFechar}
          className="absolute top-2 right-2 text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Novo Chamado</h2>

        <select
          className="w-full bg-neutral-700 p-2 rounded"
          value={clienteId}
          onChange={(e) => setClienteId(parseInt(e.target.value))}
        >
          {clientes.map((cli) => (
            <option key={cli.id} value={cli.id}>
              {cli.nome}
            </option>
          ))}
        </select>

        <select
          className="w-full bg-neutral-700 p-2 rounded"
          value={tecnico}
          onChange={(e) => setTecnico(e.target.value)}
        >
          <option value="Técnico 1">Técnico 1</option>
          <option value="Técnico 2">Técnico 2</option>
        </select>

        <select
          className="w-full bg-neutral-700 p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="aberto">Aberto</option>
          <option value="em andamento">Em andamento</option>
          <option value="finalizado">Finalizado</option>
        </select>

        {itens.map((item, index) => (
          <div
            key={index}
            className="bg-neutral-800 p-3 rounded space-y-2 relative"
          >
            {tipoUsuario !== "Atendente" && (
              <button
                onClick={() => removerItem(index)}
                className="absolute top-2 right-2 text-red-400"
              >
                <X size={16} />
              </button>
            )}

            <select
              className="w-full bg-neutral-700 p-2 rounded"
              value={item.equipamentoId}
              onChange={(e) =>
                atualizarItem(index, "equipamentoId", parseInt(e.target.value))
              }
            >
              <option value={0}>Selecione um equipamento</option>
              {equipamentosDoCliente.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome} ({e.tipo})
                </option>
              ))}
            </select>

            <textarea
              className="w-full bg-neutral-700 p-2 rounded"
              placeholder="Problema"
              value={item.problema}
              onChange={(e) =>
                atualizarItem(index, "problema", e.target.value)
              }
            />

            <textarea
              className="w-full bg-neutral-700 p-2 rounded"
              placeholder="Solução"
              value={item.solucao}
              onChange={(e) =>
                atualizarItem(index, "solucao", e.target.value)
              }
            />
          </div>
        ))}

        {tipoUsuario !== "atendente" && (
          <button
            onClick={adicionarItem}
            className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Equipamento
          </button>
        )}

        {tipoUsuario !== "atendente" ? (
          <button
            onClick={salvar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full mt-4"
          >
            Salvar Chamado
          </button>
        ) : (
          <p className="text-red-400 text-center mt-4">
            Você não tem permissão para criar chamados.
          </p>
        )}
      </div>
    </div>
  );
}
