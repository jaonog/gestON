"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Monitor,
  Users,
  UserCog,
  LogOut,
  ClipboardList,
} from "lucide-react";

// Lazy load dos componentes
const HomePage = lazy(() => import("../components/Home"));
const Chamados = lazy(() => import("../components/Chamados"));
const Equipamentos = lazy(() => import("../components/Equipamentos"));
const Clientes = lazy(() => import("../components/Clientes"));
const GerenciarUsuarios = lazy(() => import("../components/GerenciarUsuarios"));
const Relatorios = lazy(() => import("../components/Relatorios"));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "home" | "chamados" | "equipamentos" | "clientes" | "usuarios" | "relatorios"
  >("home");
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  if (typeof window !== "undefined") {
    const logado = localStorage.getItem("logado");
    const user = JSON.parse(localStorage.getItem("usuario") || "null");

    if (!logado || !user || !user.tipo) {
      router.replace("/login"); // evita histórico e loops
    } else {
      setUsuario(user);
      setLoading(false);
    }
  }
}, []);


  const isAdmin = usuario?.tipo === "admin";
  const isAtendente = usuario?.tipo === "atendente";

  if (loading) {
    return <div className="text-white p-4">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
    
      <aside className="w-64 bg-neutral-900 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">
            GEST <span className="underline decoration-sky-800">ON</span>
          </h1>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                activeTab === "home" ? "bg-skZy-800 font-semibold" : ""
              }`}
            >
              <Home size={18} />
              Início
            </button>

            <button
              onClick={() => setActiveTab("chamados")}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                activeTab === "chamados" ? "bg-sky-800 font-semibold" : ""
              }`}
            >
              <ClipboardList size={18} />
              Chamados
            </button>

            {!isAtendente && (
              <button
                onClick={() => setActiveTab("equipamentos")}
                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                  activeTab === "equipamentos" ? "bg-sky-800 font-semibold" : ""
                }`}
              >
                <Monitor size={18} />
                Equipamentos
              </button>
            )}

            <button
              onClick={() => setActiveTab("clientes")}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                activeTab === "clientes" ? "bg-sky-800 font-semibold" : ""
              }`}
            >
              <Users size={18} />
              Clientes
            </button>

            <button
              onClick={() => setActiveTab("relatorios")}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                activeTab === "relatorios" ? "bg-sky-800 font-semibold" : ""
              }`}
            >
              <FileText size={18} />
              Relatórios
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab("usuarios")}
                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-sky-800 transition-all ${
                  activeTab === "usuarios" ? "bg-sky-800 font-semibold" : ""
                }`}
              >
                <UserCog size={18} />
                Gerenciar Usuários
              </button>
            )}
          </nav>
        </div>

        <footer className="text-xs text-zinc-400">
          Bem-vindo{" "}
          {isAdmin ? "ADM" : isAtendente ? "Atendente" : "Técnico"}
          <br />
          <button
            onClick={() => {
              localStorage.removeItem("logado");
              localStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
            className="flex items-center gap-1 text-red-400 hover:text-red-200 text-sm pt-2"
          >
            <LogOut size={16} /> Sair
          </button>
        </footer>
      </aside>

      <main className="flex-1">
        <Suspense fallback={<div className="p-4">Carregando conteúdo...</div>}>
          {activeTab === "home" && <HomePage />}
          {activeTab === "chamados" && <Chamados />}
          {activeTab === "equipamentos" && !isAtendente && <Equipamentos />}
          {activeTab === "clientes" && <Clientes />}
          {activeTab === "relatorios" && <Relatorios />}
          {activeTab === "usuarios" && isAdmin && <GerenciarUsuarios />}
        </Suspense>
      </main>
    </div>
  );
}
