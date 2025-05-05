"use client";

import { useState } from "react";

type Chamado = {
  id: number;
  cliente: string;
  equipamento: string;
  problema: string;
  solucao: string;
  status: "aguardando" | "andamento" | "concluido";
};

export default function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([
    {
      id: 1,
      cliente: "João da Silva",
      equipamento: "Impressora HP 2676",
      problema: "Não liga",
      solucao: "Troca da fonte",
      status: "aguardando",
    },
  ]);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newChamado, setNewChamado] = useState<Chamado>({
    id: 0,
    cliente: "",
    equipamento: "",
    problema: "",
    solucao: "",
    status: "aguardando",
  });
  const [showForm, setShowForm] = useState(false);

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    
    if ((e.target as HTMLElement).closest("input, select")) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const updateChamado = (id: number, key: keyof Chamado, value: string) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const getStatusColor = (status: Chamado["status"]) => {
    switch (status) {
      case "aguardando":
        return "bg-red-500";
      case "andamento":
        return "bg-yellow-400";
      case "concluido":
        return "bg-green-500";
    }
  };

  const addChamado = () => {
    setChamados((prev) => [
      ...prev,
      { ...newChamado, id: prev.length + 1 },
    ]);
    setShowForm(false); 
    setNewChamado({
      id: 0,
      cliente: "",
      equipamento: "",
      problema: "",
      solucao: "",
      status: "aguardando",
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Chamados</h2>
      
      <button
        onClick={() => setShowForm(true)}
        className="bg-sky-800 text-white px-4 py-2 rounded mb-4"
      >
        Adicionar Novo Chamado
      </button>

      {showForm && (
        <div className="mb-6 p-4 bg-neutral-800 rounded">
          <h3 className="text-xl font-semibold mb-4">Novo Chamado</h3>
          <div>
            <label className="text-sm text-gray-400">Cliente:</label>
            <input
              className="w-full bg-neutral-700 p-2 rounded text-white mb-2"
              value={newChamado.cliente}
              onChange={(e) =>
                setNewChamado({ ...newChamado, cliente: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Equipamento:</label>
            <input
              className="w-full bg-neutral-700 p-2 rounded text-white mb-2"
              value={newChamado.equipamento}
              onChange={(e) =>
                setNewChamado({ ...newChamado, equipamento: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Problema:</label>
            <input
              className="w-full bg-neutral-700 p-2 rounded text-white mb-2"
              value={newChamado.problema}
              onChange={(e) =>
                setNewChamado({ ...newChamado, problema: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Solução:</label>
            <input
              className="w-full bg-neutral-700 p-2 rounded text-white mb-2"
              value={newChamado.solucao}
              onChange={(e) =>
                setNewChamado({ ...newChamado, solucao: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Status:</label>
            <select
              className="w-full bg-neutral-700 p-2 rounded text-white mb-2"
              value={newChamado.status}
              onChange={(e) =>
                setNewChamado({
                  ...newChamado,
                  status: e.target.value as Chamado["status"],
                })
              }
            >
              <option value="aguardando">Aguardando</option>
              <option value="andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
          <button
            onClick={addChamado}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Adicionar Chamado
          </button>
        </div>
      )}

      <div className="space-y-4">
        {chamados.map((chamado) => (
          <div
            key={chamado.id}
            className="border border-gray-700 rounded p-4 cursor-pointer bg-neutral-800"
            onClick={(e) => toggleExpand(chamado.id, e)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{chamado.cliente}</p>
                <p className="text-sm text-gray-400">{chamado.equipamento}</p>
              </div>

              <div className="flex gap-1">
                <span
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    chamado.status
                  )}`}
                ></span>
              </div>
            </div>

            {expandedId === chamado.id && (
              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-sm text-gray-400">Problema:</label>
                  <input
                    className="w-full bg-neutral-700 p-2 rounded text-white"
                    value={chamado.problema}
                    onChange={(e) =>
                      updateChamado(chamado.id, "problema", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Solução:</label>
                  <input
                    className="w-full bg-neutral-700 p-2 rounded text-white"
                    value={chamado.solucao}
                    onChange={(e) =>
                      updateChamado(chamado.id, "solucao", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status:</label>
                  <select
                    className="w-full bg-neutral-700 p-2 rounded text-white"
                    value={chamado.status}
                    onChange={(e) =>
                      updateChamado(
                        chamado.id,
                        "status",
                        e.target.value as Chamado["status"]
                      )
                    }
                  >
                    <option value="aguardando">Aguardando</option>
                    <option value="andamento">Em andamento</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
