"use client";

import { useEffect, useState } from "react";
import { FileText, FileCheck, Clock4, AlertCircle, ClipboardList } from "lucide-react";

type Chamado = {
  status: string;
  created_at?: string;
};

export default function Home() {
  const [chamados, setChamados] = useState<Chamado[]>([]);

  useEffect(() => {
    async function fetchChamados() {
      const res = await fetch("/api/chamados");
      const data = await res.json();
      setChamados(data);
    }

    fetchChamados();
    const interval = setInterval(fetchChamados, 10000);
    return () => clearInterval(interval);
  }, []);

  const total = chamados.length;
  const abertos = chamados.filter((c) => c.status === "aberto").length;
  const andamento = chamados.filter((c) => c.status === "em andamento").length;
  const finalizados = chamados.filter((c) => c.status === "finalizado").length;

  const cards = [
    {
      titulo: "Total de Chamados",
      valor: total,
      icone: <ClipboardList size={28} className="text-sky-400" />,
      borderColor: "border-sky-500",
    },
    {
      titulo: "Abertos",
      valor: abertos,
      icone: <AlertCircle size={28} className="text-red-400" />,
      borderColor: "border-red-500",
    },
    {
      titulo: "Em Andamento",
      valor: andamento,
      icone: <Clock4 size={28} className="text-yellow-400" />,
      borderColor: "border-yellow-500",
    },
    {
      titulo: "Finalizados",
      valor: finalizados,
      icone: <FileCheck size={28} className="text-green-400" />,
      borderColor: "border-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
        <FileText size={28} className="text-sky-400"/> Visão Geral
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-xl bg-zinc-800 border ${card.borderColor} border-b-4 p-6 transition hover:brightness-110`}
          >
            <div className="mb-3">{card.icone}</div>
            <p className="text-sm text-zinc-400">{card.titulo}</p>
            <p className="text-4xl font-extrabold text-white">{card.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

