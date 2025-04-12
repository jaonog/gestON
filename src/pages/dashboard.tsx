"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"chamados" | "equipamentos">(
    "chamados"
  );

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      <aside className="w-64 bg-neutral-900 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">
            GEST <span className="underline decoration-sky-800">ON</span>
          </h1>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab("chamados")}
              className={`text-left px-4 py-2 rounded hover:bg-sky-800 ${
                activeTab === "chamados" ? "bg-sky-800 font-semibold" : ""
              }`}
            >
              Chamados
            </button>
            <button
              onClick={() => setActiveTab("equipamentos")}
              className={`text-left px-4 py-2 rounded hover:bg-sky-800 ${
                activeTab === "equipamentos" ? "bg-sky-800 font-semibold" : ""
              }`}
            >
              Equipamentos
            </button>
          </nav>
        </div>

        <footer className="text-xs text-zinc-400">Bem-vindo USER</footer>
      </aside>

      <main className="flex-1 p-10">
        {activeTab === "chamados" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Chamados</h2>
            <p>Conteúdo de chamados aqui...</p>
          </div>
        )}

        {activeTab === "equipamentos" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Equipamentos</h2>
            <p>Conteúdo de equipamentos aqui...</p>
          </div>
        )}
      </main>
    </div>
  );
}
