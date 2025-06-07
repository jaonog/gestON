"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Chamado = {
  id: number;
  cliente: { nome: string };
  tecnico: string;
  status: string;
  data: string; // ISO
  itens: {
    equipamento: { nome: string };
    problema: string;
    solucao: string;
  }[];
};

export default function Relatorios() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState("");

  const buscarChamados = async () => {
    if (!dataSelecionada) return;

    const res = await fetch("/api/chamados");
    const todos: Chamado[] = await res.json();

    const inicio = new Date(dataSelecionada + "T00:00:00");
    const fim = new Date(dataSelecionada + "T23:59:59");

    const filtrados = todos.filter((c) => {
      const dataChamado = new Date(c.data);
      return dataChamado >= inicio && dataChamado <= fim;
    });

    setChamados(filtrados);
  };

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Chamados - GEST ON", 14, 20);
    doc.setFontSize(12);
    doc.text(`Data: ${dataSelecionada || "?"}`, 14, 30);

    const rows: any[] = [];

    chamados.forEach((chamado) => {
      chamado.itens.forEach((item) => {
        rows.push([
          chamado.id,
          chamado.cliente?.nome || "-",
          item.equipamento?.nome || "-",
          chamado.status,
          chamado.tecnico,
          item.problema,
          item.solucao,
          new Date(chamado.data).toLocaleDateString(),
        ]);
      });
    });

    autoTable(doc, {
      head: [
        [
          "ID",
          "Cliente",
          "Equipamento",
          "Status",
          "Técnico",
          "Problema",
          "Solução",
          "Data",
        ],
      ],
      body: rows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 104, 168] },
    });

    doc.save("relatorio-chamados.pdf");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText size={24} className="text-sky-400" /> Relatórios
      </h2>

      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <label className="flex flex-col text-sm font-medium">
          Data dos Chamados
          <input
            type="date"
            className="bg-neutral-800 text-white p-2 rounded mt-1"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>

        <button
          onClick={buscarChamados}
          className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded"
        >
          Buscar Chamados
        </button>

        <button
          onClick={gerarPDF}
          disabled={chamados.length === 0}
          className={`${
            chamados.length === 0
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          } text-white px-4 py-2 rounded flex items-center gap-2`}
        >
          <Download size={16} /> Gerar PDF
        </button>
      </div>

      <p className="text-white/70 mb-4">
        {chamados.length > 0
          ? `${chamados.reduce((acc, c) => acc + c.itens.length, 0)} itens listados em ${chamados.length} chamados.`
          : "Nenhum chamado listado."}
      </p>
    </div>
  );
}
