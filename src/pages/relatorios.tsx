// app/relatorios/page.tsx (ou pages/relatorios.tsx se não usar App Router)
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface Chamado {
  id: number;
  status: string;
  tecnico: string;
}

export default function Relatorios() {
  const [chamados, setChamados] = useState<Chamado[]>([]);

  useEffect(() => {
    fetch("/api/chamados")
      .then((res) => res.json())
      .then((data) => setChamados(data));
  }, []);

  const total = chamados.length;

  const porStatus = chamados.reduce(
    (acc: Record<string, number>, chamado) => {
      acc[chamado.status] = (acc[chamado.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const porTecnico = chamados.reduce(
    (acc: Record<string, number>, chamado) => {
      acc[chamado.tecnico] = (acc[chamado.tecnico] || 0) + 1;
      return acc;
    },
    {}
  );

  const statusData = {
    labels: Object.keys(porStatus),
    datasets: [
      {
        label: "Chamados por status",
        data: Object.values(porStatus),
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24"],
      },
    ],
  };

  const tecnicoData = {
    labels: Object.keys(porTecnico),
    datasets: [
      {
        label: "Chamados por técnico",
        data: Object.values(porTecnico),
        backgroundColor: ["#818cf8", "#f472b6", "#facc15", "#2dd4bf"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-sky-400 p-4 rounded-md shadow text-white">
        <h1 className="text-2xl font-bold">Relatórios</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-medium">Total de chamados: {total}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Chamados por status</h2>
            <Pie data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Chamados por técnico</h2>
            <Bar data={tecnicoData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
