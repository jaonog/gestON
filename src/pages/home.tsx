"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

type Chamado = {
  id: number;
  cliente: { nome: string };
  equipamento: { nome: string };
  status: string;
  problema: string;
  solucao: string;
  tecnico: string;
  tipo: string;
  data: string;
};

export default function Home() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const buscarChamados = async () => {
    const res = await fetch("/api/chamados");
    const todos = await res.json();

    const filtrados = todos.filter((c: Chamado) => {
      const dataChamado = new Date(c.data).getTime();
      const inicio = new Date(dataInicial).getTime();
      const fim = new Date(dataFinal).getTime();
      return dataChamado >= inicio && dataChamado <= fim;
    });

    setChamados(filtrados);
  };

  useEffect(() => {
    if (dataInicial && dataFinal) {
      buscarChamados();
    }
  }, [dataInicial, dataFinal]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText size={24} className="text-sky-400" />
        Painel de Chamados
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <label className="flex flex-col">
          Data Inicial
          <input
            type="date"
            className="bg-neutral-800 text-white p-2 rounded"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          Data Final
          <input
            type="date"
            className="bg-neutral-800 text-white p-2 rounded"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
        </label>
        <button
          onClick={buscarChamados}
          className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded"
        >
          Buscar Chamados
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="min-w-full text-sm text-left bg-neutral-900">
          <thead className="bg-sky-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Equipamento</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Técnico</th>
              <th className="p-3">Problema</th>
              <th className="p-3">Solução</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((c) => (
              <tr key={c.id} className="border-t border-neutral-800 hover:bg-neutral-800 transition">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.cliente?.nome || "-"}</td>
                <td className="p-3">{c.equipamento?.nome || "-"}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{c.tipo}</td>
                <td className="p-3">{c.tecnico}</td>
                <td className="p-3">{c.problema}</td>
                <td className="p-3">{c.solucao}</td>
                <td className="p-3">
                  {new Date(c.data).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {chamados.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-white/60">
                  Nenhum chamado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
